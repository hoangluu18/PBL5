import React, { useState, useEffect, useContext } from 'react';
import {
    Layout, Table, Card, Input, Button, Space, Tag, Tooltip, Row, Col,
    Pagination, Modal, Form, InputNumber, message, Typography, Checkbox,
    Divider
} from 'antd';
import {
    SearchOutlined, FilterOutlined, PlusOutlined, EditOutlined,
    DeleteOutlined, ExclamationCircleOutlined, ReloadOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { Product, ProductsResponse } from '../../../models/Product';
import { ProductService } from '../../../services/shop/ProductService.service';
import ProductDetailModal from './ProductDetailModal';
import { ProductDetail } from '../../../models/ProductDetail';
import { AuthContext } from '../../../utils/auth.context';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { confirm } = Modal;

const ProductManagement: React.FC = () => {
    const { user } = useContext(AuthContext);
    // Constants
    const SHOP_ID = user.id || 1; 
    const productService = new ProductService();
    // States
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // Frontend page starts at 1
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);

    // Filter states
    const [searchKeyword, setSearchKeyword] = useState('');
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [stockFilter, setStockFilter] = useState<number | null>(null);

    // Form states
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [form] = Form.useForm();
    const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
    //Sort
    // Thêm state để theo dõi trạng thái sắp xếp
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null);

    useEffect(() => {
        document.title = "Quản lý Hàng hóa";
        fetchProducts();
    }, [currentPage, pageSize, sortField, sortOrder, stockFilter]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            let response: ProductsResponse;
            
            console.log("Fetching products with filters:", {
                search: searchKeyword,
                minPrice,
                maxPrice,
                stockFilter,
                page: currentPage,
                sort: sortField,
                order: sortOrder,
                shopId: SHOP_ID // Log để debug
            });
            
            // Chuẩn hóa tham số sắp xếp
            const sort = sortField || 'lastUpdated';
            const order = sortOrder === 'ascend' ? 'asc' : 'desc';
            
            if (searchKeyword) {
                response = await productService.searchProducts(
                    searchKeyword,
                    currentPage - 1,
                    pageSize,
                    sort,
                    order,
                    SHOP_ID
                );
            } else if (minPrice !== null && maxPrice !== null) {
                response = await productService.filterByPrice(
                    minPrice,
                    maxPrice,
                    currentPage - 1,
                    pageSize,
                    sort,
                    order,
                    SHOP_ID
                );
            } else if (stockFilter !== null) {
                response = await productService.filterByStock(
                    stockFilter,
                    currentPage - 1,
                    pageSize,
                    sort,
                    order,
                    SHOP_ID
                );
            } else {
                // Trường hợp mặc định
                response = await productService.getProducts(
                    currentPage - 1,
                    pageSize,
                    sort,
                    order,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    SHOP_ID
                );
            }
            
            setProducts(response.products);
            setTotalItems(response.totalItems);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            message.error("Không thể tải danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number, newPageSize?: number) => {
        setCurrentPage(page);
        if (newPageSize) setPageSize(newPageSize);
    };

    const handleSearch = (value: string) => {
        setSearchKeyword(value);
        setCurrentPage(1);
        fetchProducts();
    };

    const handlePriceFilter = () => {
        if (minPrice !== null && maxPrice !== null) {
            setCurrentPage(1);
            fetchProducts();
        } else {
            message.warn("Vui lòng nhập đầy đủ khoảng giá");
        }
    };

    const handleStockFilter = (value: number | null) => {
        // Nếu click vào giá trị hiện tại, xóa filter
        const newValue = stockFilter === value ? null : value;
        
        // Chỉ cập nhật state, fetchProducts sẽ được gọi tự động nhờ useEffect
        setStockFilter(newValue);
        setCurrentPage(1);
    };

  
    const resetFilters = () => {
        setSearchKeyword('');
        setMinPrice(null);
        setMaxPrice(null);
        setStockFilter(null);
        setCurrentPage(1);
        
        // Đơn giản chỉ gọi lại fetchProducts
        setTimeout(() => {
            fetchProducts();
        }, 0);
    };

    const showAddModal = () => {
        setIsCreateMode(true);
        setDetailModalVisible(true);
    };


    const handleDeleteProduct = (id: number) => {
        confirm({
            title: 'Xác nhận xóa sản phẩm',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
            onOk: async () => {
                try {
                    await productService.deleteProduct(id);
                    message.success("Đã xóa sản phẩm");
                    fetchProducts();
                } catch (error) {
                    console.error("Failed to delete product:", error);
                    message.error("Không thể xóa sản phẩm");
                }
            }
        });
    };


    // Format date to local string
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    };

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        // Cập nhật trạng thái sắp xếp
        setSortField(sorter.field);
        setSortOrder(sorter.order);
    };

    const columns = [
        {
            title: 'Mã hàng',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'mainImage',
            key: 'mainImage',
            width: 80,
            render: (mainImage: string) => (
                <img
                    src={mainImage} // Sử dụng trực tiếp URL từ API response
                    alt="Sản phẩm"
                    style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                    }}
                    onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/60x60/eee/ccc?text=No+Image';
                    }}
                />
            ),
        },
        {
            title: 'Tên hàng',
            dataIndex: 'name',
            sorter: (a, b) => a.price - b.price,
            key: 'name',
        },
        {
            title: 'Giá bán',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => price.toLocaleString('vi-VN') + ' đ',
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Giảm giá',
            dataIndex: 'discountPercent',
            key: 'discountPercent',
            render: (discountPercent: number) => discountPercent ? `${discountPercent}%` : '-',
            sorter: (a, b) => (a.discountPercent || 0) - (b.discountPercent || 0),
        },
        {
            title: 'Giá vốn',
            dataIndex: 'cost',
            key: 'cost',
            render: (cost: number) => cost.toLocaleString('vi-VN') + ' đ',
            sorter: (a, b) => a.cost - b.cost,
        },
        {
            title: 'Tồn kho',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity: number) => (
                <Tag color={quantity > 10 ? 'green' : quantity > 0 ? 'gold' : 'red'}>
                    {quantity}
                </Tag>
            ),
            sorter: (a, b) => a.quantity - b.quantity,
        },
        {
            title: 'Thời gian update',
            dataIndex: 'lastUpdated',
            key: 'lastUpdated',
            render: (lastUpdated: string) => formatDate(lastUpdated),
            sorter: (a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime(),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: Product) => (
                <Space size="small">
                    <Tooltip title="Chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewProductDetail(record.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const handleViewProductDetail = (productId: number) => {
        setSelectedProductId(productId);
        setDetailModalVisible(true);
    };

    const handleSelectionChange = (selectedRowKeys: React.Key[], selectedRows: Product[]) => {
        console.log(`Selected row keys: ${selectedRowKeys}`);
        console.log('Selected rows: ', selectedRows);
        // You can use these selected rows for batch operations later
    };

    const handleProductCreated = (newProduct: ProductDetail) => {
        fetchProducts(); // Tải lại danh sách sản phẩm
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Quản lý Hàng hóa</Title>

            <Layout style={{ background: 'none' }}>
                {/* Sidebar filters */}
                <Sider
                    width={250}
                    theme="light"
                    style={{
                        background: '#f9f9f9',
                        padding: '16px',
                        borderRadius: '8px',
                        marginRight: '16px'
                    }}
                >
                    <Title level={4}>Bộ lọc</Title>

                    <Divider />

                    <Title level={5}>Lọc theo giá</Title>
                    <Space direction="vertical" style={{ width: '100%', marginBottom: '16px' }}>
                        <Text>Giá từ:</Text>
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            value={minPrice}
                            onChange={(value) => setMinPrice(value)}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                        />

                        <Text>Đến:</Text>
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            value={maxPrice}
                            onChange={(value) => setMaxPrice(value)}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                        />

                        <Button
                            type="primary"
                            style={{ width: '100%', marginTop: '8px' }}
                            onClick={handlePriceFilter}
                        >
                            Áp dụng
                        </Button>
                    </Space>

                    <Divider />

                    <Title level={5}>Lọc theo tồn kho</Title>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Checkbox
                            onChange={() => handleStockFilter(10)}
                            checked={stockFilter === 10}
                        >
                            Sắp hết hàng (&lt; 10)
                        </Checkbox>
                        <Checkbox
                            onChange={() => handleStockFilter(0)}
                            checked={stockFilter === 0}
                        >
                            Hết hàng
                        </Checkbox>
                    </Space>

                    <Divider />

                    <Button
                        type="default"
                        icon={<ReloadOutlined />}
                        danger
                        onClick={resetFilters}
                        style={{ width: '100%' }}
                    >
                        Xóa bộ lọc
                    </Button>
                </Sider>

                {/* Main content */}
                <Content>
                    <Card bordered={false} style={{ marginBottom: '16px' }}>
                        <Row gutter={16} align="middle" justify="space-between">
                            <Col span={8}>
                                <Input.Search
                                    placeholder="Tìm kiếm sản phẩm"
                                    onSearch={handleSearch}
                                    enterButton={<SearchOutlined />}
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    allowClear
                                />
                            </Col>

                            <Col span={16} style={{ textAlign: 'right' }}>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={showAddModal}
                                >
                                    Thêm sản phẩm mới
                                </Button>
                            </Col>
                        </Row>
                    </Card>

                    <Table
                        rowSelection={{
                            type: 'checkbox',
                            onChange: handleSelectionChange,
                        }}
                        columns={columns}
                        dataSource={products}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        loading={loading}
                        onChange={handleTableChange}
                        sortDirections={['ascend', 'descend']}
                    />

                    <div style={{ marginTop: '16px', textAlign: 'right' }}>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={totalItems}
                            onChange={handlePageChange}
                            showSizeChanger
                            showTotal={(total) => `Tổng ${total} sản phẩm`}
                        />
                    </div>
                </Content>
            </Layout>

            <ProductDetailModal
                productId={selectedProductId}
                visible={detailModalVisible}
                onClose={() => {
                    setDetailModalVisible(false);
                    setIsCreateMode(false);
                }}
                isCreateMode={isCreateMode}
                onProductCreated={handleProductCreated}
            />
        </div>
    );
};

export default ProductManagement;
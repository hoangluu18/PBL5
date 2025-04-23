import { useEffect, useState } from "react";
import SearchResponse from "../models/bean/SearchResponse";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CategoryService from "../services/category.service";
import {
    Avatar, Button, Checkbox, Col, Divider, Layout, Rate,
    Row, Spin, Space, Select, notification, Breadcrumb,
    InputNumberProps, InputNumber, Card, Typography, Badge, Empty, Tag,
    Pagination
} from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import ProductCard from "../components/ProductCard";
import {
    SearchOutlined, FilterOutlined, HomeOutlined,
    AppstoreOutlined, TagOutlined, StarOutlined,
    DollarOutlined, ClearOutlined, SortAscendingOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ICategoryDto } from "../models/dto/CategoryDto";
import ProductService from "../services/product.service";

const { Option } = Select;
const { Title, Text } = Typography;

const ProductFilterPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [filters, setFilters] = useState<SearchResponse>();
    const [breadcrumbs, setBreadcrumbs] = useState<ICategoryDto[]>([]);

    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(0);
    const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [sortOption, setSortOption] = useState<string>("newest");
    const [page, setPage] = useState<number>(1);

    const [clickFilterPrice, setClickFilterPrice] = useState<boolean>(false);

    const { alias } = useParams<{ alias: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const query = new URLSearchParams(location.search);
    const keyword = query.get("keyword") || "";


    useEffect(() => {
        updateUrlAndSearch();
        if (alias) {
            fetchBreadcrumb();
        }
    }, [alias, selectedRating, selectedBrands,
        clickFilterPrice, sortOption, location.search]);

    document.title = `Tìm kiếm sản phẩm${keyword ? `: ${keyword}` : ""}`;

    const searchProducts = async () => {
        setLoading(true);

        try {

            if (alias) {
                const categoryService = new CategoryService();
                const data = await categoryService.searchProductByCategory(
                    alias, minPrice, maxPrice, selectedBrands,
                    selectedRating, sortOption, keyword, page
                );
                setFilters(data);
            } else if (keyword) {
                const productService = new ProductService();
                const data = await productService.searchProducts(
                    minPrice, maxPrice, selectedBrands, selectedRating,
                    sortOption, keyword, page
                );
                setFilters(data);
            }
            else {
                notification.error({
                    message: "Lỗi",
                    description: "Không tìm thấy danh mục sản phẩm"
                });
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
            notification.error({
                message: "Lỗi",
                description: "Không thể tải sản phẩm, vui lòng thử lại sau"
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchBreadcrumb = async () => {
        try {
            const categoryService = new CategoryService();
            if (alias) {
                const data = await categoryService.getBreadcrumb(alias);
                setBreadcrumbs(data);
            }
        } catch (error) {
            console.error("Failed to fetch breadcrumb:", error);
            notification.error({
                message: "Lỗi",
                description: "Không thể tải thông tin danh mục"
            });
        }
    };

    const updateUrlAndSearch = () => {
        const queryParams = new URLSearchParams();

        if (minPrice > 0) queryParams.set("minPrice", minPrice.toString());
        if (maxPrice > 0) queryParams.set("maxPrice", maxPrice.toString());
        if (selectedRating > 0) queryParams.set("rating", selectedRating.toString());
        if (selectedBrands.length) {
            queryParams.set("brands", selectedBrands.join(","));
        }
        if (sortOption) queryParams.set("sortOption", sortOption);
        if (keyword) queryParams.set("keyword", keyword);

        navigate({ pathname: location.pathname, search: queryParams.toString() });
        searchProducts();
    };

    const changeMinPrice: InputNumberProps['onChange'] = (value) => {
        setMinPrice(parseInt(value?.toString() || "0"));
    };

    const changeMaxPrice: InputNumberProps['onChange'] = (value) => {
        setMaxPrice(parseInt(value?.toString() || "0"));
    };

    const filterRating = (rating: number) => {
        setSelectedRating(rating === selectedRating ? 0 : rating);
    };

    const filterBrands = (id: number) => {
        if (selectedBrands.includes(id)) {
            setSelectedBrands(selectedBrands.filter((brandId) => brandId !== id));
        } else {
            setSelectedBrands([...selectedBrands, id]);
        }
    };

    const filterPrice = () => {
        setClickFilterPrice(!clickFilterPrice);
    };

    const filterSortOption = (value: string) => {
        setSortOption(value);
    };

    const resetFilters = () => {
        setMinPrice(0);
        setMaxPrice(0);
        setSelectedBrands([]);
        setSelectedRating(0);
        setSortOption("newest");
        setClickFilterPrice(prev => !prev);
    };


    const handlePageChange = (page: number) => {
        setPage(page);
    };

    const products = filters?.products || [];
    const activeFiltersCount = (minPrice > 0 ? 1 : 0) +
        (maxPrice > 0 ? 1 : 0) +
        selectedBrands.length +
        (selectedRating > 0 ? 1 : 0) +
        (keyword ? 1 : 0);

    return (
        <div className="container py-4">
            <Breadcrumb
                className="mb-4"
                items={[
                    {
                        key: "home",
                        title: <Link to="/" className="text-decoration-none"><HomeOutlined /> Trang chủ</Link>
                    },
                    ...(breadcrumbs?.map((breadCrumb) => ({
                        key: breadCrumb.alias,
                        title: <Link to={`/c/${breadCrumb.alias}`} className="text-decoration-none">{breadCrumb.name}</Link>,
                    })) || []),
                ]}
            />

            <Layout className="bg-transparent">
                <Sider
                    width={280}
                    className="bg-white p-4 mr-4 rounded shadow-sm"
                    style={{ borderRadius: "8px" }}
                >
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <Title level={4} style={{ margin: 0 }}>
                            <FilterOutlined className="mr-2" /> Bộ lọc
                        </Title>
                        {activeFiltersCount > 0 && (
                            <Badge count={activeFiltersCount} color="#1890ff">
                                <Text type="secondary">Đang lọc</Text>
                            </Badge>
                        )}
                    </div>

                    <Card
                        title={
                            <span>
                                <AppstoreOutlined className="mr-2" /> Danh mục
                            </span>
                        }
                        size="small"
                        className="mb-4"
                        bodyStyle={{ maxHeight: "200px", overflow: "auto" }}
                    >
                        {filters?.categories && filters.categories.map((category) => (
                            <div key={category.name} className="py-1">
                                <Link
                                    to={`/c/${category.alias}`}
                                    className={`d-block ${category.alias === alias ? "fw-bold text-primary" : "text-body"}`}
                                    style={{ transition: "all 0.2s" }}
                                >
                                    {category.name}
                                </Link>
                            </div>
                        ))}
                    </Card>

                    <Card
                        title={
                            <span>
                                <DollarOutlined className="mr-2" /> Khoảng giá
                            </span>
                        }
                        size="small"
                        className="mb-4"
                    >
                        <Space direction="vertical" className="w-100" size="small">
                            <InputNumber
                                placeholder="Giá tối thiểu"
                                value={minPrice || null}
                                onChange={changeMinPrice}
                                addonAfter="₫"
                                type="number"
                                min={0}
                                className="w-100"
                                style={{ borderRadius: "4px" }}
                            />
                            <InputNumber
                                placeholder="Giá tối đa"
                                value={maxPrice || null}
                                onChange={changeMaxPrice}
                                addonAfter="₫"
                                type="number"
                                min={0}
                                className="w-100"
                                style={{ borderRadius: "4px" }}
                            />
                            <Button
                                type="primary"
                                className="w-100 mt-2"
                                onClick={filterPrice}
                                icon={<SearchOutlined />}
                            >
                                Áp dụng
                            </Button>
                        </Space>
                    </Card>

                    <Card
                        title={
                            <span>
                                <TagOutlined className="mr-2" /> Nhãn hàng
                            </span>
                        }
                        size="small"
                        className="mb-4"
                        bodyStyle={{ maxHeight: "200px", overflow: "auto" }}
                    >
                        {filters?.brands && filters.brands.length > 0 ? (
                            filters.brands.map((brand) => (
                                <div key={brand.id} className="d-flex align-items-center justify-content-between mb-2">
                                    <Checkbox
                                        checked={selectedBrands.includes(brand.id)}
                                        onChange={() => filterBrands(brand.id)}
                                    >
                                        <span style={{ marginLeft: "8px" }}>{brand.name}</span>
                                    </Checkbox>
                                    {brand.logo && (
                                        <Avatar
                                            src={`http://localhost:5173/src/assets/brand-images/${brand.logo}`}
                                            size="small"
                                            className="ms-2"
                                            style={{ border: "1px solid #f0f0f0" }}
                                        />
                                    )}
                                </div>
                            ))
                        ) : (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có nhãn hàng" />
                        )}
                    </Card>

                    <Card
                        title={
                            <span>
                                <StarOutlined className="mr-2" /> Đánh giá
                            </span>
                        }
                        size="small"
                        className="mb-4"
                    >
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div
                                key={rating}
                                className={`filter-item rating-item py-1 px-2 mb-1 d-flex align-items-center ${selectedRating === rating ? "bg-light rounded" : ""
                                    }`}
                                onClick={() => filterRating(rating)}
                                style={{
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                }}
                            >
                                <Rate
                                    value={rating}
                                    disabled
                                    className="customize-star-spacing"
                                    style={{ fontSize: "14px", color: "#fadb14", pointerEvents: "none" }}
                                />
                                <span className="ms-2" style={{ fontSize: "14px" }}>
                                    {rating === 5 ? '' : 'trở lên'}
                                </span>
                            </div>
                        ))}
                    </Card>

                    <Button
                        danger
                        icon={<ClearOutlined />}
                        className="w-100"
                        onClick={resetFilters}
                        disabled={activeFiltersCount === 0}
                    >
                        Xóa tất cả bộ lọc
                    </Button>
                </Sider>

                <Content>
                    <Card className="mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <Title level={5} style={{ margin: 0 }}>
                                    Kết quả tìm kiếm: {products.length} sản phẩm
                                </Title>
                                {activeFiltersCount > 0 && (
                                    <Space size={[0, 8]} wrap className="mt-2">
                                        {keyword && (
                                            <Tag color="blue" closable onClose={() => navigate({ pathname: '/' })}>
                                                Từ khóa: {keyword}
                                            </Tag>
                                        )
                                        }
                                        {minPrice > 0 && (
                                            <Tag color="blue" closable onClose={() => setMinPrice(0)}>
                                                Giá từ: {minPrice.toLocaleString()}₫
                                            </Tag>
                                        )}
                                        {maxPrice > 0 && (
                                            <Tag color="blue" closable onClose={() => setMaxPrice(0)}>
                                                Giá đến: {maxPrice.toLocaleString()}₫
                                            </Tag>
                                        )}
                                        {selectedRating > 0 && (
                                            <Tag color="blue" closable onClose={() => setSelectedRating(0)}>
                                                Đánh giá: {selectedRating}⭐ trở lên
                                            </Tag>
                                        )}
                                        {selectedBrands.length > 0 && filters?.brands && (
                                            <>
                                                {selectedBrands.map(brandId => {
                                                    const brand = filters.brands.find(b => b.id === brandId);
                                                    return brand ? (
                                                        <Tag
                                                            key={brandId}
                                                            color="blue"
                                                            closable
                                                            onClose={() => filterBrands(brandId)}
                                                        >
                                                            {brand.name}
                                                        </Tag>
                                                    ) : null;
                                                })}
                                            </>
                                        )}
                                    </Space>
                                )}
                            </div>

                            <Space>
                                <SortAscendingOutlined />
                                <span>Sắp xếp theo:</span>
                                <Select
                                    value={sortOption}
                                    style={{ width: 170 }}
                                    onChange={filterSortOption}
                                    bordered
                                >
                                    <Option value="newest">Mới nhất</Option>
                                    <Option value="price_asc">Giá thấp đến cao</Option>
                                    <Option value="price_desc">Giá cao đến thấp</Option>
                                    <Option value="rating_asc">Đánh giá thấp đến cao</Option>
                                    <Option value="rating_desc">Đánh giá cao đến thấp</Option>
                                </Select>
                            </Space>
                        </div>
                    </Card>

                    {loading ? (
                        <div className="text-center p-5 bg-white rounded shadow-sm">
                            <Spin size="large" />
                            <p className="mt-3">Đang tải sản phẩm...</p>
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <Row gutter={[24, 24]}  className="ms-2">
                                {products.map((product) => (
                                    <Col span={6} key={product.id || product.name} >
                                        <ProductCard {...product} />
                                    </Col>
                                ))}
                            </Row>
                            {
                                filters?.totalPages && filters.totalPages > 1 && (
                                    <div className="text-center mt-4">
                                        <Pagination
                                            current={filters.currentPage}
                                            total={filters.totalElements}
                                            pageSize={12}
                                            showSizeChanger={false}
                                            onChange={handlePageChange}
                                        />
                                    </div>
                                )
                            }
                        </>
                    ) : (
                        <Card className="text-center py-5">
                            <Empty
                                description={
                                    <div>
                                        <Title level={5}>Không tìm thấy sản phẩm phù hợp</Title>
                                        <Text type="secondary">Vui lòng thử lại với bộ lọc khác</Text>
                                    </div>
                                }
                            />
                            <Button
                                type="primary"
                                onClick={resetFilters}
                                className="mt-3"
                                disabled={activeFiltersCount === 0}
                            >
                                Xóa bộ lọc
                            </Button>
                        </Card>
                    )}
                </Content>
            </Layout>
        </div>
    );
};

export default ProductFilterPage;
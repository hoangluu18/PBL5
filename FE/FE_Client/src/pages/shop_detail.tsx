import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Image as AntImage, List, Button, Rate, Tabs, Input, Avatar, 
    Descriptions, Statistic, Divider,  Empty } from "antd";
import {
    ShoppingCartOutlined,
    EyeOutlined,
    SearchOutlined,
    UserOutlined,
    CalendarOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    PieChartOutlined,
    StarFilled,
    TeamOutlined,
    ShoppingOutlined,
    MessageOutlined,
    InfoCircleOutlined,
    CheckCircleOutlined,
    PlusOutlined
} from "@ant-design/icons";
import ProductCard from "../components/ProductCard";
import { useParams } from "react-router-dom";
import ShopInfoService from "../services/shop_info.service";
import ShopInfoDto from "../models/dto/detail_shop/ShopInfoDto";
import { message, Spin } from "antd";
import ProductDto from "../models/dto/ProductDto";
const { Title, Text, Paragraph } = Typography;


const bestSellingProducts = [
    {
        id: 1,
        name: "Máy tính bảng cho trẻ em chống sốc",
        price: 1000000,
        discountPercent: 10,
        mainImage: "tablet1.jpg", 
        averageRating: 4.5,
        reviewCount: 120,
        alias: "may-tinh-bang-cho-tre-em-chong-soc"
    },
    {
        id: 2,
        name: "Combo bàn phím + chuột Bluetooth TEKKIN",
        price: 189000,
        discountPercent: 5,
        mainImage: "keyboard-mouse-combo.jpg",
        averageRating: 4.2,
        reviewCount: 85,
        alias: "combo-ban-phim-chuot-bluetooth-tekkin"
    },
    {
        id: 3,
        name: "Chuột Bluetooth không dây cao cấp TEKKIN",
        price: 145000,
        discountPercent: 0,
        mainImage: "mouse1.jpg",
        averageRating: 4.8,
        reviewCount: 230,
        alias: "chuot-bluetooth-khong-day-cao-cap-tekkin"
    },
    {
        id: 4,
        name: "Tai nghe gaming TEKKIN X2000",
        price: 350000,
        discountPercent: 15,
        mainImage: "headphone1.jpg",
        averageRating: 4.6,
        reviewCount: 78,
        alias: "tai-nghe-gaming-tekkin-x2000"
    }
];



// Custom Image component that maintains aspect ratio
const ResponsiveImage = ({ src, alt }: { src: string; alt: string }) => {
    return (
        <div style={{ position: "relative", width: "100%", paddingBottom: "100%", overflow: "hidden", maxHeight: "180px" }}>
            <AntImage
                src={src}
                alt={alt}
                preview={false}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    maxHeight: "180px",
                }}
            />
        </div>
    );
};



const ShopDetail: React.FC = () => {
    const [activeTab, setActiveTab] = useState("1");
    const [shopInfo, setShopInfo] = useState<ShopInfoDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [bestSellingProducts, setBestSellingProducts] = useState<ProductDto[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const { id } = useParams<{ id: string }>();
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const shopId = id ? parseInt(id) : 1;
                const shopInfoService = new ShopInfoService();
                
                // Lấy thông tin shop
                const shopData = await shopInfoService.getShopInfo(shopId);
                setShopInfo(shopData);
                
                // Lấy sản phẩm trang 1
                const productsData = await shopInfoService.getProductByShopId(shopId, 1);
                setProducts(productsData);
                
                // Nếu có sản phẩm, giả sử 4 sản phẩm đầu tiên là bán chạy nhất
                if (productsData.length > 0) {
                    const featuredProducts = productsData.slice(0, Math.min(4, productsData.length));
                    setBestSellingProducts(featuredProducts);
                }
                
                // Kiểm tra xem có trang tiếp theo không
                setHasMore(productsData.length >= 12); // Giả sử mỗi trang có 10 sản phẩm
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                message.error("Không thể tải thông tin. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Reset state khi id thay đổi
        return () => {
            setProducts([]);
            setBestSellingProducts([]);
            setPage(1);
            setHasMore(true);
        };
    }, [id]);
    
    const loadMoreProducts = async () => {
        if (loadingProducts || !hasMore) return;
        
        try {
            setLoadingProducts(true);
            const nextPage = page + 1;
            const shopId = id ? parseInt(id) : 1;
            const shopInfoService = new ShopInfoService();
            
            const moreProducts = await shopInfoService.getProductByShopId(shopId, nextPage);
            
            if (moreProducts.length > 0) {
                setProducts(prev => [...prev, ...moreProducts]);
                setPage(nextPage);
                setHasMore(moreProducts.length >= 10); // Giả sử mỗi trang có 10 sản phẩm
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Lỗi khi tải thêm sản phẩm:", error);
            message.error("Không thể tải thêm sản phẩm. Vui lòng thử lại sau.");
        } finally {
            setLoadingProducts(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" tip="Đang tải thông tin cửa hàng..." />
            </div>
        );
    }

    if (!shopInfo) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Title level={3}>Không tìm thấy thông tin cửa hàng</Title>
                <Paragraph>Cửa hàng không tồn tại hoặc đã bị xóa.</Paragraph>
            </div>
        );
    }
    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            {/* Thông tin Shop */}
            <Card style={{ marginBottom: '20px', borderRadius: '4px' }}>
                <Row align="middle" gutter={16}>
                    <Col>
                        <AntImage
                            src={shopInfo.photo || "https://via.placeholder.com/80"}
                            alt="Shop logo"
                            preview={false}
                            width={80}
                            height={80}
                            style={{ borderRadius: '4px' }}
                        />
                    </Col>
                    <Col>
                        <Title level={4} style={{ margin: '0 0 8px 0' }}>{shopInfo.name}</Title>
                        <Row align="middle" gutter={16}>
                            <Col>
                                <Rate disabled defaultValue={shopInfo.rating} style={{ fontSize: '14px' }} />
                            </Col>
                            <Col>
                                <Text type="secondary">{shopInfo.peopleTracking} Người theo dõi</Text>
                            </Col>
                            <Col>
                                <Button type="primary" size="small">
                                    + Theo Dõi
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>

            {/* Menu điều hướng */}
            <Row gutter={16} style={{ marginBottom: '20px' }} align="middle">
                <Col xs={24} md={16}>
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        style={{ marginBottom: 0 }}
                    >
                        <Tabs.TabPane tab="Cửa hàng" key="1" />
                        <Tabs.TabPane tab="Tất cả sản phẩm" key="2" />
                        <Tabs.TabPane tab="Hồ sơ cửa hàng" key="3" />
                    </Tabs>
                </Col>
                <Col xs={24} md={8}>
                    <Input.Search
                        placeholder="Tìm kiếm sản phẩm trong cửa hàng"
                        enterButton={<SearchOutlined />}
                        size="middle"
                        style={{ width: '100%' }}
                    />
                </Col>
            </Row>
            
            {/* Cửa hàng */}
            {activeTab === "1" && (
                <>
                    {/* Bán chạy nhất */}
                    <Title level={5} style={{ marginTop: "20px", marginBottom: "16px" }}>
                        <span role="img" aria-label="fire">🔥</span> Bán chạy nhất
                    </Title>
                    {bestSellingProducts.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            {bestSellingProducts.map((product) => (
                                <Col xs={24} sm={12} md={8} lg={6} xl={6} key={product.id}>
                                    <ProductCard {...product} />
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Empty description="Không có sản phẩm nào" />
                    )}

                    {/* Tất cả sản phẩm */}
                    <Title level={5} style={{ marginTop: "40px", marginBottom: "16px" }}>
                        <span role="img" aria-label="shopping">🛍️</span> Tất cả sản phẩm
                    </Title>
                    {products.length > 0 ? (
                        <>
                            <Row gutter={[16, 16]}>
                                {products.map((product) => (
                                    <Col xs={12} sm={8} md={6} lg={6} xl={4} key={product.id}>
                                        <ProductCard {...product} />
                                    </Col>
                                ))}
                            </Row>
                            
                            {/* Nút xem thêm */}
                            {hasMore && (
                                <div style={{ textAlign: 'center', margin: '30px 0' }}>
                                    <Button 
                                        onClick={loadMoreProducts} 
                                        loading={loadingProducts}
                                        type="primary" 
                                        size="large"
                                    >
                                        {loadingProducts ? 'Đang tải...' : 'Xem thêm sản phẩm'}
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <Empty description="Không có sản phẩm nào" />
                    )}
                </>
            )}
            
            {/* Tất cả sản phẩm */}
            {activeTab === "2" && (
                <>
                    <Title level={5} style={{ marginBottom: "16px" }}>
                        <span role="img" aria-label="shopping">🛍️</span> Tất cả sản phẩm
                    </Title>
                    {products.length > 0 ? (
                        <>
                            <Row gutter={[16, 16]}>
                                {products.map((product) => (
                                    <Col xs={12} sm={8} md={6} lg={4} xl={4} key={product.id}>
                                        <ProductCard {...product} />
                                    </Col>
                                ))}
                            </Row>
                            
                            {/* Nút xem thêm */}
                            {hasMore && (
                                <div style={{ textAlign: 'center', margin: '30px 0' }}>
                                    <Button 
                                        onClick={loadMoreProducts} 
                                        loading={loadingProducts}
                                        type="primary" 
                                        size="large"
                                    >
                                        {loadingProducts ? 'Đang tải...' : 'Xem thêm sản phẩm'}
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <Empty description="Không có sản phẩm nào" />
                    )}
                </>
            )}

            {/* Hồ sơ cửa hàng */}
            {activeTab === "3" && (
                <>
                    <Row gutter={[24, 24]}>
                        {/* Thông tin cơ bản */}
                        <Col xs={24} md={8}>
                            <Card
                                title={<><UserOutlined /> Thông tin cửa hàng</>}
                                bordered={false}
                                style={{ height: '100%' }}
                            >
                                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                    <Avatar size={100} src={shopInfo.photo} />
                                    <Title level={4} style={{ marginTop: '16px', marginBottom: '8px' }}>{shopInfo.name}</Title>
                                    <Button type="primary" icon={<PlusOutlined />}>Theo dõi</Button>
                                </div>

                                <Descriptions column={1} size="small" layout="vertical" bordered>
                                    <Descriptions.Item label="Ngày tham gia">
                                        <CalendarOutlined /> {new Date(shopInfo.createdAt).toLocaleDateString('vi-VN')}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Email">
                                        <MailOutlined /> {shopInfo.email}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Điện thoại">
                                        <PhoneOutlined /> {shopInfo.phone || "Chưa cung cấp"}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Địa chỉ">
                                        <EnvironmentOutlined /> {shopInfo.address || "Chưa cung cấp"}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        </Col>

                        {/* Thống kê và đánh giá */}
                        <Col xs={24} md={16}>
                            <Card
                                title={<><PieChartOutlined /> Thống kê cửa hàng</>}
                                bordered={false}
                                style={{ marginBottom: '24px' }}
                            >
                                <Row gutter={[16, 16]}>
                                    <Col xs={12} sm={8}>
                                        <Statistic
                                            title="Đánh giá"
                                            value={shopInfo.rating}
                                            suffix="/5"
                                            prefix={<StarFilled style={{ color: '#faad14' }} />}
                                            precision={1}
                                        />
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Statistic
                                            title="Người theo dõi"
                                            value={shopInfo.peopleTracking}
                                            prefix={<TeamOutlined />}
                                        />
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Statistic
                                            title="Sản phẩm"
                                            value={shopInfo.productAmount}
                                            prefix={<ShoppingOutlined />}
                                        />
                                    </Col>
                                </Row>
                            </Card>

                            <Card
                                title={<><InfoCircleOutlined /> Giới thiệu cửa hàng</>}
                                bordered={false}
                            >
                                <Paragraph>
                                    {shopInfo.description || "Cửa hàng chưa cập nhật thông tin giới thiệu."}
                                </Paragraph>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
}

export default ShopDetail;



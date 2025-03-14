import React from "react";
import { Card, Row, Col, Typography, Image as AntImage, List, Button, Rate, Tabs, Input, Avatar, Descriptions, Statistic, Divider } from "antd";
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
import { useState } from 'react';

const { Title, Text, Paragraph } = Typography;

// Thông tin Shop
const shopInfo = {
    id: 1,
    name: "TEKKIN OFFICIAL STORE",
    enabled: true,
    description: "TEKKIN OFFICIAL STORE là đại lý chính hãng của TEKKIN tại Việt Nam, chuyên cung cấp các sản phẩm công nghệ chất lượng cao với giá cả hợp lý. Chúng tôi cam kết mang đến cho khách hàng những trải nghiệm mua sắm tốt nhất với dịch vụ chăm sóc khách hàng chuyên nghiệp.",
    address: "Số 123 Đường ABC, Quận XYZ, Thành phố HCM",
    created_at: "2023-01-01T08:00:00",
    updated_at: "2025-03-10T15:30:00",
    photo: "https://via.placeholder.com/100",
    banner_photo: "https://via.placeholder.com/1200x300",
    user_id: 101,
    
    // Thông tin bổ sung cho UI
    rating: 4.5,
    followers: 73,
    total_products: 12,
    chat_response_rate: 98,
    phone: "+84 123 456 789",
    email: "contact@tekkin.com",
    policies: [
        'Bảo hành chính hãng 12 tháng cho tất cả sản phẩm',
        'Đổi trả miễn phí trong vòng 7 ngày',
        'Giao hàng toàn quốc',
        'Hỗ trợ kỹ thuật 24/7'
    ]
};

// Sản phẩm bán chạy nhất
const bestSellingProducts = [
    {
        id: 1,
        name: "Máy tính bảng cho trẻ em chống sốc",
        price: "999.000₫",
        image: "https://via.placeholder.com/150",
    },
    {
        id: 2,
        name: "Combo bàn phím + chuột Bluetooth",
        price: "189.000₫",
        image: "https://via.placeholder.com/150",
    },
    {
        id: 3,
        name: "Chuột Bluetooth không dây cao cấp",
        price: "145.000₫",
        image: "https://via.placeholder.com/150",
    },
];

// Danh sách tất cả sản phẩm
const allProducts = [
    {
        id: 1,
        name: "Máy tính bảng cho trẻ em",
        price: "1.599.000₫",
        image: "https://via.placeholder.com/150",
    },
    {
        id: 2,
        name: "Quạt mini cầm tay TEKKIN",
        price: "129.000₫",
        image: "https://via.placeholder.com/150",
    },
    {
        id: 3,
        name: "Bàn phím không dây TEKKIN",
        price: "367.830₫",
        image: "https://via.placeholder.com/150",
    },
    {
        id: 4,
        name: "Chuột Bluetooth Không Dây TEKKIN đảm bảo vệ sinh an toàn ",
        price: "57.000₫",
        image: "https://via.placeholder.com/150",
    },
    {
        id: 5,
        name: "Nồi cơm điện TEKKIN",
        price: "289.000₫",
        image: "https://via.placeholder.com/150",
    },
    {
        id: 6,
        name: "Nồi cơm điện TEKKIN",
        price: "289.000₫",
        image: "https://via.placeholder.com/150",
    },
    {
        id: 7,
        name: "Nồi cơm điện TEKKIN",
        price: "289.000₫",
        image: "https://via.placeholder.com/150",
    },
    {
        id: 8,
        name: "Nồi cơm điện TEKKIN",
        price: "289.000₫",
        image: "https://via.placeholder.com/150",
    },
    {
        id: 9,
        name: "Nồi cơm điện TEKKIN",
        price: "289.000₫",
        image: "https://via.placeholder.com/150",
    },
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

// Product card component for consistency
const ProductCard = ({ product }: { product: any }) => {
    return (
        <Card
            hoverable
            cover={<ResponsiveImage src={product.image} alt={product.name} />}
            actions={[<EyeOutlined key="view" />, <ShoppingCartOutlined key="cart" />]}
            bodyStyle={{
                padding: '12px',
                height: '88px',  // Tăng chiều cao để đảm bảo đủ không gian cho 2 dòng text
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
            style={{
                width: '100%',
                marginBottom: '10px',
                borderRadius: '4px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
        >
            <div className="product-title" style={{
                height: '40px',  // Chiều cao cố định cho phần tiêu đề
                marginBottom: '4px'
            }}>
                <Typography.Text
                    ellipsis={{ tooltip: product.name }}
                    style={{
                        fontSize: '14px',
                        lineHeight: '1.2',
                        fontWeight: '500',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {product.name}
                </Typography.Text>
            </div>
            <Text strong style={{ color: '#f5222d', fontSize: '14px' }}>
                {product.price}
            </Text>
        </Card>
    );
};

const ShopDetail: React.FC = () => {
    const [activeTab, setActiveTab] = useState("1");

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            {/* Thông tin Shop */}
            <Card style={{ marginBottom: '20px', borderRadius: '4px' }}>
                <Row align="middle" gutter={16}>
                    <Col>
                        <AntImage
                            src="https://via.placeholder.com/80"
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
                                <Text type="secondary">{shopInfo.followers} Người theo dõi</Text>
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

            {activeTab === "1" && (
                <>
                    {/* Bán chạy nhất */}
                    <Title level={5} style={{ marginTop: "20px", marginBottom: "16px" }}>
                        <span role="img" aria-label="fire">🔥</span> Bán chạy nhất
                    </Title>
                    <Row gutter={[16, 16]}>
                        {bestSellingProducts.map((product) => (
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={product.id}>
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>

                    {/* Tất cả sản phẩm */}
                    <Title level={5} style={{ marginTop: "20px", marginBottom: "16px" }}>
                        <span role="img" aria-label="shopping">🛍️</span> Tất cả sản phẩm
                    </Title>
                    <Row gutter={[16, 16]}>
                        {allProducts.map((product) => (
                            <Col xs={12} sm={8} md={6} lg={6} xl={4} key={product.id}>
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>
                </>
            )}

            {activeTab === "2" && (
                <>
                    <Title level={5} style={{ marginBottom: "16px" }}>
                        <span role="img" aria-label="shopping">🛍️</span> Tất cả sản phẩm
                    </Title>
                    <Row gutter={[16, 16]}>
                        {[...bestSellingProducts, ...allProducts].map((product) => (
                            <Col xs={12} sm={8} md={6} lg={4} xl={4} key={product.id}>
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>
                </>
            )}

{activeTab === "3" && (
    <>
        {/* Banner cửa hàng */}
        <div style={{ position: 'relative', marginBottom: '20px', borderRadius: '8px', overflow: 'hidden' }}>
            <AntImage
                src={shopInfo.banner_photo}
                alt={`${shopInfo.name} Banner`}
                preview={false}
                width="100%"
                height={200}
                style={{ objectFit: 'cover' }}
            />
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '15px',
                borderRadius: '8px'
            }}>
                <Title level={4} style={{ margin: 0 }}>{shopInfo.name}</Title>
            </div>
        </div>

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
                            <CalendarOutlined /> {new Date(shopInfo.created_at).toLocaleDateString('vi-VN')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            <MailOutlined /> {shopInfo.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Điện thoại">
                            <PhoneOutlined /> {shopInfo.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ">
                            <EnvironmentOutlined /> {shopInfo.address}
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
                        <Col xs={12} sm={6}>
                            <Statistic
                                title="Đánh giá"
                                value={shopInfo.rating}
                                suffix="/5"
                                prefix={<StarFilled style={{ color: '#faad14' }} />}
                                precision={1}
                            />
                        </Col>
                        <Col xs={12} sm={6}>
                            <Statistic
                                title="Người theo dõi"
                                value={shopInfo.followers}
                                prefix={<TeamOutlined />}
                            />
                        </Col>
                        <Col xs={12} sm={6}>
                            <Statistic
                                title="Sản phẩm"
                                value={shopInfo.total_products}
                                prefix={<ShoppingOutlined />}
                            />
                        </Col>
                        <Col xs={12} sm={6}>
                            <Statistic
                                title="Phản hồi chat"
                                value={shopInfo.chat_response_rate}
                                suffix="%"
                                prefix={<MessageOutlined />}
                            />
                        </Col>
                    </Row>
                </Card>

                <Card
                    title={<><InfoCircleOutlined /> Giới thiệu cửa hàng</>}
                    bordered={false}
                >
                    <Paragraph>
                        {shopInfo.description}
                    </Paragraph>

                    <Divider orientation="left">Chính sách cửa hàng</Divider>
                    <List
                        size="small"
                        bordered
                        dataSource={shopInfo.policies}
                        renderItem={(item) => (
                            <List.Item>
                                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                                {item}
                            </List.Item>
                        )}
                    />
                </Card>
            </Col>
        </Row>
    </>
)}
        </div>
    );
}

export default ShopDetail;



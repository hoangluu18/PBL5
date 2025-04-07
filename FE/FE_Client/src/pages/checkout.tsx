import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Space, Button, Typography, Spin, Card, Skeleton, Result } from 'antd';
import { RightOutlined, ShoppingCartOutlined, HomeOutlined } from '@ant-design/icons';
import ShippingInfo from '../components/ShippingInfo';
import PaymentMethod from '../components/PaymentMethod';
import OrderSummary from '../components/OrderSummary';
import { getCheckoutInfo, saveCheckout } from '../services/checkout.service';
import { CheckoutInfoDto } from '../models/dto/checkout/CheckoutInfoDto';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const { Content } = Layout;
const { Title, Text } = Typography;

const Checkout: React.FC = () => {
    const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfoDto | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [loading, setLoading] = useState(true);
    const [isNotFound, setIsNotFound] = useState(false);
    const navigate = useNavigate();
    const customerId = 1; // Có thể lấy từ context, params, hoặc localStorage tùy vào thiết kế ứng dụng
    
    useEffect(() => {
        const fetchCheckoutInfo = async () => {
            try {
                const data = await getCheckoutInfo();
                setCheckoutInfo(data);
            } catch (error) {
                console.error('Error fetching checkout info:', error);
                
                // Check if this is a 404 error
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    setIsNotFound(true);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCheckoutInfo();
    }, []);

    if (loading) {
        return (
            <Layout style={{
                background: 'linear-gradient(0deg, #F5F7FA, #F5F7FA), #FFFFFF',
                minHeight: '100vh',
                width: '100%',
                maxWidth: '1920px',
                margin: '0 auto',
                padding: '20px'
            }}>
                <Content className='container'>
                    <div style={{ marginBottom: '20px' }}>
                        <Skeleton active paragraph={{ rows: 0 }} />
                    </div>
                    
                    <Skeleton.Input style={{ width: 300, marginBottom: 20 }} active size="large" />
                    
                    <Row gutter={24}>
                        <Col span={16}>
                            <Card style={{ marginBottom: '20px' }}>
                                <Skeleton active avatar paragraph={{ rows: 3 }} />
                            </Card>
                            <Card>
                                <Skeleton active paragraph={{ rows: 4 }} />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <Skeleton active paragraph={{ rows: 6 }} />
                            </Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        );
    }

    if (isNotFound) {
        return (
            <Layout style={{
                background: 'linear-gradient(0deg, #F5F7FA, #F5F7FA), #FFFFFF',
                minHeight: '100vh',
                width: '100%',
                maxWidth: '1920px',
                margin: '0 auto',
                padding: '20px'
            }}>
                <Content className='container'>
                    <Result
                        status="404"
                        title="Giỏ hàng trống"
                        subTitle="Bạn chưa chọn sản phẩm nào để thanh toán. Vui lòng thêm sản phẩm vào giỏ hàng trước."
                        extra={[
                            <Button 
                                type="primary" 
                                key="cart" 
                                icon={<ShoppingCartOutlined />}
                            >
                                <Link to="/cart">Quay về giỏ hàng</Link>
                            </Button>,
                            <Button 
                                key="home" 
                                icon={<HomeOutlined />}
                            >
                                <Link to="/">Tiếp tục mua sắm</Link>
                            </Button>
                        ]}
                    />
                </Content>
            </Layout>
        );
    }

    if (!checkoutInfo) {
        return (
            <Layout style={{
                background: 'linear-gradient(0deg, #F5F7FA, #F5F7FA), #FFFFFF',
                minHeight: '100vh',
                width: '100%',
                maxWidth: '1920px',
                margin: '0 auto',
                padding: '20px'
            }}>
                <Content className='container'>
                    <Result
                        status="error"
                        title="Lỗi tải thông tin"
                        subTitle="Có lỗi xảy ra khi tải thông tin thanh toán. Vui lòng thử lại sau."
                        extra={[
                            <Button 
                                type="primary" 
                                key="retry"
                                onClick={() => window.location.reload()}
                            >
                                Thử lại
                            </Button>,
                            <Button 
                                key="home"
                            >
                                <Link to="/">Quay về trang chủ</Link>
                            </Button>
                        ]}
                    />
                </Content>
            </Layout>
        );
    }

    // The rest of your existing code
    const subtotal = checkoutInfo.cartProductDtoList.reduce((sum, item) => sum + (item.lastPrice * item.quantity), 0);
    const shippingCost = checkoutInfo.shippingRespondDtoList.reduce((sum, shipping) => sum + shipping.shippingCost, 0);
    const total = subtotal + shippingCost;

    // Rest of the existing component...

    const handlePurchase = () => {
        // Kiểm tra nếu phương thức thanh toán không phải là COD
        if (paymentMethod !== 'cash') {
            alert('Phương thức thanh toán này chưa được hỗ trợ. Mong bạn thông cảm!');
            return;
        }
        
        // Nếu là COD, tiếp tục như bình thường
        if (window.confirm('Bạn có chắc chắn muốn mua hàng không?')) {
            setLoading(true);
            saveCheckout(customerId)
                .then(() => {
                    alert('Đặt hàng thành công!');
                    navigate('/'); // Chuyển về trang chủ hoặc trang xác nhận đơn hàng
                })
                .catch((error: any) => {
                    console.error('Lỗi khi đặt hàng:', error);
                    alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };
    
    return (
        <Layout style={{
            background: 'linear-gradient(0deg, #F5F7FA, #F5F7FA), #FFFFFF',
            minHeight: '100vh',
            width: '100%',
            maxWidth: '1920px',
            margin: '0 auto',
            padding: '20px'
        }}>
            <Content className='container'>
                <div style={{ marginBottom: '20px' }}>
                    <Space size="small">
                        <Button href='/' type="link" style={{ padding: 0 }}>Trang chủ</Button>
                        <RightOutlined style={{ fontSize: '12px' }} />
                        <Button href='/cart' type="link" style={{ padding: 0 }}>Giỏ hàng</Button>
                        <RightOutlined style={{ fontSize: '12px' }} />
                        <Text type="secondary">Thanh toán</Text>
                    </Space>
                </div>

                <Title level={2}>Thanh toán</Title>

                <Row gutter={24}>
                    <Col span={16}>
                        <ShippingInfo addressInfo={checkoutInfo.addressInfoDto} />
                        <PaymentMethod 
                            paymentMethod={paymentMethod} 
                            setPaymentMethod={setPaymentMethod} 
                            shippingCosts={checkoutInfo.shippingRespondDtoList.map(shipping => ({
                                shopId: shipping.shopId,
                                shippingCost: shipping.shippingCost
                            }))}
                        />
                    </Col>

                    <Col span={8}>
                        <OrderSummary
                            orderItems={checkoutInfo.cartProductDtoList.map(item => ({
                                id: item.productId,
                                name: item.productName,
                                price: item.lastPrice,
                                quantity: item.quantity,
                                image: `/src/assets/product-images/${item.photo}`,
                                shopId: item.shopId,
                                shopName: item.shopName
                            }))}
                            subtotal={subtotal}
                            shippingCost={shippingCost}
                            total={total}
                        />
                    </Col>
                </Row>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button 
                        type="primary" 
                        size="large" 
                        style={{ width: '300px', height: '45px' }}
                        onClick={handlePurchase}
                        loading={loading}
                    >
                        Mua hàng
                    </Button>
                </div>
            </Content>

            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                background: 'white',
                padding: '10px 15px',
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer'
            }}>
            </div>

            <style>{`
                .selected-delivery {
                    border: 2px solid #1890ff;
                }
                .ant-radio-wrapper {
                    margin-right: 0;
                }
            `}</style>
        </Layout>
    );
};

export default Checkout;
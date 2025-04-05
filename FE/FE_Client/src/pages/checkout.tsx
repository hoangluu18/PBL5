import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Space, Button, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import ShippingInfo from '../components/ShippingInfo';
import PaymentMethod from '../components/PaymentMethod';
import OrderSummary from '../components/OrderSummary';
import { getCheckoutInfo, saveCheckout } from '../services/checkout.service';
import { CheckoutInfoDto } from '../models/dto/checkout/CheckoutInfoDto';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text } = Typography;

const Checkout: React.FC = () => {
    const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfoDto | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('credit');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const customerId = 1; // Có thể lấy từ context, params, hoặc localStorage tùy vào thiết kế ứng dụng
    useEffect(() => {
        const fetchCheckoutInfo = async () => {
            try {
                const data = await getCheckoutInfo();
                setCheckoutInfo(data);
            } catch (error) {
                console.error('Error fetching checkout info:', error);
            }
        };

        fetchCheckoutInfo();
    }, []);

    if (!checkoutInfo) {
        return <div>Loading...</div>;
    }

    const subtotal = checkoutInfo.cartProductDtoList.reduce((sum, item) => sum + (item.lastPrice * item.quantity), 0);
    const shippingCost = checkoutInfo.shippingRespondDtoList.reduce((sum, shipping) => sum + shipping.shippingCost, 0);
    const total = subtotal + shippingCost;

    const handlePurchase = () => {
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
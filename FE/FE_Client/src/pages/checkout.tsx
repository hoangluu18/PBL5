import React, { useState } from 'react';
import { Layout, Row, Col, Space, Button, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import ShippingInfo from '../components/ShippingInfo';
import DeliveryOptions from '../components/DeliveryOptions';
import PaymentMethod from '../components/PaymentMethod';
import OrderSummary from '../components/OrderSummary';

const { Content } = Layout;
const { Title, Text } = Typography;

const Checkout: React.FC = () => {
    const [deliveryType, setDeliveryType] = useState('standard');
    const [paymentMethod, setPaymentMethod] = useState('credit');

    // Dữ liệu đã cập nhật với thông tin shop
    const orderItems = [
        {
            id: 1,
            name: 'Đồng hồ thông minh Fitbit Sense',
            price: 1998000,
            quantity: 1,
            image: '/fitbit.png',
            shopId: 1,
            shopName: 'Fitbit Official Store'
        },
        {
            id: 2,
            name: 'iPhone 13 pro max - Pacific Blue - 128GB',
            price: 28990000,
            quantity: 1,
            image: '/iphone.png',
            shopId: 2,
            shopName: 'Apple Authorized Reseller'
        },
        {
            id: 3,
            name: 'Apple MacBook Pro 13 inch - M1 - 8/256GB',
            price: 31990000,
            quantity: 1,
            image: '/macbook.png',
            shopId: 2,
            shopName: 'Apple Authorized Reseller'
        },
        {
            id: 4,
            name: 'Tai nghe AirPods Pro',
            price: 4590000,
            quantity: 2,
            image: '/airpods.png',
            shopId: 2,
            shopName: 'Apple Authorized Reseller'
        },
        {
            id: 5,
            name: 'Bàn phím Logitech MX Keys',
            price: 2790000,
            quantity: 1,
            image: '/keyboard.png',
            shopId: 3,
            shopName: 'Logitech Official Store'
        }
    ];

    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = 1500000;
    const tax = subtotal * 0.1; // Giả sử thuế là 10%
    const shippingCost = 30000;
    const total = subtotal - discount + tax + shippingCost;

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
                        <Button type="link" style={{ padding: 0 }}>Trang chủ</Button>
                        <RightOutlined style={{ fontSize: '12px' }} />
                        <Button type="link" style={{ padding: 0 }}>Giỏ hàng</Button>
                        <RightOutlined style={{ fontSize: '12px' }} />
                        <Text type="secondary">Thanh toán</Text>
                    </Space>
                </div>

                <Title level={2}>Thanh toán</Title>

                <Row gutter={24}>
                    <Col span={16}>
                        <ShippingInfo />
                        <DeliveryOptions deliveryType={deliveryType} setDeliveryType={setDeliveryType} />
                        <PaymentMethod paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
                    </Col>

                    <Col span={8}>
                        <OrderSummary
                            orderItems={orderItems}
                            subtotal={subtotal}
                            discount={discount}
                            tax={tax}
                            shippingCost={shippingCost}
                            total={total}
                        />
                    </Col>
                </Row>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button type="primary" size="large" style={{ width: '300px', height: '45px' }}>
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
                <span>Chat demo</span>
                <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: 'green',
                    display: 'inline-block'
                }}></span>
            </div>

            <style>{`
                .selected-delivery {
                    border: 2px solid #1890ff;
                }
                .ant-radio-wrapper {
                    margin-right: 0;
                }
            `}</style>
        </Layout >
    );
};

export default Checkout;
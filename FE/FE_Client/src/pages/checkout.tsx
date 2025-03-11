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

    const orderItems = [
        {
            id: 1,
            name: 'Đồng hồ thông minh Fitbit Sense',
            price: 398,
            quantity: 1,
            image: '/fitbit.png'
        },
        {
            id: 2,
            name: 'iPhone 13 pro max-Pacific Blue-128GB',
            price: 398,
            quantity: 1,
            image: '/iphone.png'
        },
        {
            id: 3,
            name: 'Apple MacBook Pro 13 inch-M1-8/256GB',
            price: 65,
            quantity: 1,
            image: '/macbook.png'
        }
    ];

    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = 59;
    const tax = 126.20;
    const shippingCost = 30;
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
            <Content style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '20px' }}>
                    <Space size="small">
                        <Button type="link" style={{ padding: 0 }}>Trang 1</Button>
                        <RightOutlined style={{ fontSize: '12px' }} />
                        <Button type="link" style={{ padding: 0 }}>Trang 2</Button>
                        <RightOutlined style={{ fontSize: '12px' }} />
                        <Text type="secondary">Mặc định</Text>
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
                        <OrderSummary orderItems={orderItems} subtotal={subtotal} discount={discount} tax={tax} shippingCost={shippingCost} total={total} />
                    </Col>
                </Row>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button type="primary" size="large" style={{ width: '300px', height: '45px' }}>
                        Thanh toán {total.toFixed(2)}đ
                    </Button>
                    <div style={{ marginTop: '10px' }}>
                        <Button type="link">Lưu đơn hàng và thoát</Button>
                    </div>
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
        </Layout>
    );
};

export default Checkout;
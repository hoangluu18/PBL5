import React from 'react';
import { Card, List, Avatar, Divider, Typography, Button } from 'antd';

const { Title, Text } = Typography;

const OrderSummary: React.FC<{ orderItems: any[], subtotal: number, discount: number, tax: number, shippingCost: number, total: number }> = ({ orderItems, subtotal, discount, tax, shippingCost, total }) => {
    return (
        <Card
            title="Đơn hàng"
            extra={<Button type="link">Chỉnh sửa giỏ hàng</Button>}
            bordered={false}
            style={{ marginBottom: '20px' }}
        >
            <List
                itemLayout="horizontal"
                dataSource={orderItems}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <div style={{ width: '60px', height: '60px', marginRight: '10px' }}>
                                    <Avatar shape="square" size={60} src={item.image} />
                                </div>
                            }
                            title={<div style={{ fontSize: '14px' }}>{item.name}</div>}
                            description={<div style={{ marginTop: '5px' }}>{item.price}đ</div>}
                        />
                        <div>x{item.quantity}</div>
                    </List.Item>
                )}
            />

            <Divider />

            <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <Text>Tổng sản phẩm:</Text>
                <Text>{subtotal}đ</Text>
            </div>

            <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <Text>Giảm giá:</Text>
                <Text style={{ color: 'green' }}>-{discount}đ</Text>
            </div>

            <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <Text>Thuế:</Text>
                <Text>{tax.toFixed(2)}đ</Text>
            </div>

            <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <Text>Tạm tính:</Text>
                <Text>{(subtotal - discount + tax).toFixed(2)}đ</Text>
            </div>

            <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <Text>Phí vận chuyển:</Text>
                <Text>{shippingCost}đ</Text>
            </div>

            <Divider />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Title level={5} style={{ margin: 0 }}>Tổng cộng:</Title>
                <Title level={4} style={{ margin: 0 }}>{total.toFixed(2)}đ</Title>
            </div>
        </Card>
    );
};

export default OrderSummary;
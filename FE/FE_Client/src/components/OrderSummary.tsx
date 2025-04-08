import React from 'react';
import { Card, List, Avatar, Divider, Typography, Button } from 'antd';

const { Title, Text } = Typography;

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  shopId: number;
  shopName: string;
}

interface OrderSummaryProps {
  orderItems: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderItems,
  subtotal,
  shippingCost,
  total
}) => {
  // Nhóm các sản phẩm theo shop
  const itemsByShop: { [key: number]: { shopName: string; items: OrderItem[]; subtotal: number } } = {};

  orderItems.forEach(item => {
    if (!itemsByShop[item.shopId]) {
      itemsByShop[item.shopId] = {
        shopName: item.shopName,
        items: [],
        subtotal: 0,
      };
    }
    itemsByShop[item.shopId].items.push(item);
    itemsByShop[item.shopId].subtotal += item.price * item.quantity;
  });

  return (
    <Card
      title={<div style={{ textAlign: 'center' }}>Đơn hàng</div>}
      bordered={false}
      style={{ marginBottom: '20px' }}
    >
      {/* Hiển thị sản phẩm theo từng shop */}
      {Object.entries(itemsByShop).map(([shopId, shop]) => (
        <div key={shopId} style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ marginBottom: '10px' }}>
            {shop.shopName}
          </Title>
          <List
            itemLayout="horizontal"
            dataSource={shop.items}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <div style={{ width: '60px', height: '60px', marginRight: '10px' }}>
                      <Avatar shape="square" size={60} src={item.image} />
                    </div>
                  }
                  title={<div style={{ fontSize: '14px' }}>{item.name}</div>}
                  description={<div style={{ marginTop: '5px' }}>{item.price.toLocaleString()}đ</div>}
                />
                <div>x{item.quantity}</div>
              </List.Item>
            )}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
            <Text strong>Tổng tiền shop:</Text>
            <Text strong>{shop.subtotal.toLocaleString()}đ</Text>
          </div>
          <Divider style={{ margin: '10px 0' }} />
        </div>
      ))}

      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <Text>Tổng sản phẩm:</Text>
        <Text>{subtotal.toLocaleString()}đ</Text>
      </div>

      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <Text>Phí vận chuyển:</Text>
        <Text>{shippingCost.toLocaleString()}đ</Text>
      </div>

      <Divider />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Title level={5} style={{ margin: 0 }}>Tổng cộng:</Title>
        <Title level={4} style={{ margin: 0 }}>{total.toLocaleString()}đ</Title>
      </div>
    </Card>
  );
};

export default OrderSummary;
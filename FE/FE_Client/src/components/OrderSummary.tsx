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
  total,
}) => {
  // Nhóm sản phẩm theo shop
  const itemsByShop: {
    [shopId: number]: {
      shopName: string;
      items: OrderItem[];
      subtotal: number;
    };
  } = {};

  orderItems.forEach((item) => {
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

  const formatPrice = (price: number) => {
    return Math.round(price).toLocaleString('vi-VN') + 'đ';
  };

  return (
    <Card
      title={<div style={{ textAlign: 'center' }}>Đơn hàng</div>}
      bordered={false}
      style={{ marginBottom: '20px' }}
    >
      {orderItems.length === 0 ? (
        <Text type="secondary">Chưa có sản phẩm nào trong đơn hàng.</Text>
      ) : (
        <>
          {Object.entries(itemsByShop).map(([shopId, shop]) => (
            <div key={shopId} style={{ marginBottom: '20px' }}>
              <Title level={5} style={{ marginBottom: '10px' }}>
                {shop.shopName}
              </Title>
              <List
                itemLayout="horizontal"
                dataSource={shop.items}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <div
                          style={{
                            width: '60px',
                            height: '60px',
                            marginRight: '10px',
                          }}
                        >
                          <Avatar
                            shape="square"
                            size={60}
                            src={item.image.startsWith('http') ? item.image : `http://localhost:5173/src/assets/product-images/${item.image}`}
                          />
                        </div>
                      }
                      title={
                        <div style={{ fontSize: '14px' }}>{item.name}</div>
                      }
                      description={
                        <div style={{ marginTop: '5px' }}>
                          <Text strong style={{ color: '#ff4d4f' }}>
                            {formatPrice(item.price)}
                          </Text>
                        </div>
                      }
                    />
                    <div>x{item.quantity}</div>
                  </List.Item>
                )}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                }}
              >
                <Text strong>Tổng tiền shop:</Text>
                <Text strong>{formatPrice(shop.subtotal)}</Text>
              </div>
              <Divider style={{ margin: '10px 0' }} />
            </div>
          ))}

          <div
            style={{
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Text>Tổng sản phẩm:</Text>
            <Text>{formatPrice(subtotal)}</Text>
          </div>


          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Title level={5} style={{ margin: 0 }}>
              Tổng cộng:
            </Title>
            <Title level={4} style={{ margin: 0 }}>
              {formatPrice(total)}
            </Title>
          </div>
        </>
      )}
    </Card>
  );
};

export default OrderSummary;

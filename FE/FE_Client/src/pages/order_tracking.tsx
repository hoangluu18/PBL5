import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Card, Typography, Badge, Button, Spin, message } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { AuthContext } from '../components/context/auth.context';
import OrderService from '../services/order.service';
import { OrderInfoDto } from '../models/dto/OrderInfoDto';

const { Title } = Typography;



// Helper function để lấy màu trạng thái
const getStatusColor = (status: string) => {
  switch (status) {
    case 'DELIVERED':
      return 'success';
    case 'SHIPPING':
      return 'processing';
    case 'PROCESSING':
      return 'warning';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
};

const OrderTracking: React.FC = () => {
  const { customer } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderInfoDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customer) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [customer]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const orderService = new OrderService();
      const data = await orderService.getOrders(customer?.id);
      setOrders(data);
    } catch (error) {
      message.error('Không thể tải danh sách đơn hàng');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (orderId: string) => {
    navigate(`/order-detail/${orderId}`);
  };

  const continueShopping = () => {
    navigate('/');
  };

  const formatDate = (dateString: string): string => {
    try {
      // Kiểm tra xem dateString có phải dạng ISO 8601 không
      if (!dateString) return '';

      const date = new Date(dateString);

      // Kiểm tra nếu date không hợp lệ
      if (isNaN(date.getTime())) return dateString;

      // Định dạng ngày tháng kiểu Việt Nam
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(',', '');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Trả về nguyên chuỗi nếu có lỗi
    }
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date: string) => <span>{formatDate(date)}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status: string) => (
        <Badge status={getStatusColor(status) as any} text={status} />
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => <span>{amount.toLocaleString('vi-VN')} đ</span>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: OrderInfoDto) => (
        <>
          <Button
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(record.orderId);
            }}
          >
            Xem chi tiết
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card
        title={<Title level={4}>Theo dõi đơn hàng</Title>}
        extra={<Button type="default" icon={<ShoppingOutlined />} onClick={continueShopping}>Tiếp tục mua sắm</Button>}
      >
        <Spin spinning={loading} tip="Đang tải...">
          <Table
            dataSource={orders}
            columns={columns}
            rowKey="orderId"
            pagination={
              orders.length > 10 ? { pageSize: 10 } : false
            }
            onRow={(record) => ({
              onClick: () => handleViewDetails(record.orderId),
              style: { cursor: 'pointer' }
            })}
            locale={{ emptyText: 'Không có đơn hàng nào' }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default OrderTracking;
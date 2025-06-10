import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Select,
  Tooltip,
  Input,
  DatePicker,
  Modal,
  Typography,
  Divider,
  message,
  Badge,
  Drawer,
  Descriptions,
  Row,
  Col
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  SyncOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { useContext } from 'react';
import { AuthContext } from '../../utils/auth.context';
import { Order } from '../../models/OrderDto';
import LogisticService from '../../services/logistic/logistic.service';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Cập nhật interface OrderProductsDto theo cấu trúc mới
interface OrderProductsDto {
  productId?: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  image?: string;
}


interface StatusStep {
  status: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

// Định nghĩa các bước trạng thái và thông tin hiển thị tương ứng
const statusSteps: StatusStep[] = [
  {
    status: 'NEW',
    title: 'Mới',
    icon: <ClockCircleOutlined />,
    color: '#1890ff',
    description: 'Đơn hàng mới được tạo'
  },
  {
    status: 'PAID',
    title: 'Đã thanh toán',
    icon: <CheckCircleOutlined />,
    color: '#13c2c2',
    description: 'Đơn hàng đã được thanh toán'
  },
  {
    status: 'PROCESSING',
    title: 'Đang xử lý',
    icon: <SyncOutlined spin />,
    color: '#faad14',
    description: 'Đơn hàng đang được xử lý'
  },
  {
    status: 'PACKAGED',
    title: 'Đã đóng gói',
    icon: <CheckCircleOutlined />,
    color: '#2f54eb',
    description: 'Đơn hàng đã được đóng gói'
  },
  {
    status: 'PICKED',
    title: 'Đã lấy hàng',
    icon: <CheckCircleOutlined />,
    color: '#722ed1',
    description: 'Đơn hàng đã được lấy'
  },
  {
    status: 'SHIPPING',
    title: 'Đang giao hàng',
    icon: <CarOutlined />,
    color: '#fa8c16',
    description: 'Đơn hàng đang được giao'
  },
  {
    status: 'DELIVERED',
    title: 'Đã giao',
    icon: <CheckCircleOutlined />,
    color: '#52c41a',
    description: 'Đơn hàng đã giao thành công'
  },
  {
    status: 'CANCELLED', // Thêm trạng thái hủy vào mảng chính
    title: 'Đã hủy',
    icon: <CloseCircleOutlined />,
    color: '#f5222d',
    description: 'Đơn hàng đã bị hủy'
  },
  {
    status: 'RETURN_REQUESTED',
    title: 'Yêu cầu trả hàng',
    icon: <SyncOutlined />,
    color: '#fa541c',
    description: 'Khách hàng yêu cầu trả hàng'
  },
  {
    status: 'RETURNED',
    title: 'Đã trả hàng',
    icon: <SyncOutlined />,
    color: '#f5222d',
    description: 'Đơn hàng đã được trả lại'
  },
  {
    status: 'REFUNDED',
    title: 'Đã hoàn tiền',
    icon: <CheckCircleOutlined />,
    color: '#eb2f96',
    description: 'Đơn hàng đã hoàn tiền'
  }
];

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
  const [statusModalVisible, setStatusModalVisible] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, searchText, selectedStatus, dateRange]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const logisticService = new LogisticService();
      const res = await logisticService.getOrders()
      setTimeout(() => {

        setOrders(res);
        setFilteredOrders(res);
        setPagination(prev => ({
          ...prev,
          total: res.length
        }));
        setLoading(false);
      }, 500); // giả lập thời gian tải dữ liệu
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Không thể tải dữ liệu đơn hàng');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...orders];

    // Lọc theo từ khóa tìm kiếm
    if (searchText) {
      result = result.filter(order =>
        order.orderId.toString().includes(searchText.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        order.phoneNumber.includes(searchText)
      );
    }

    // Lọc theo trạng thái
    if (selectedStatus) {
      result = result.filter(order => order.orderStatus === selectedStatus);
    }

    // Lọc theo khoảng thời gian
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf('day');
      const endDate = dateRange[1].endOf('day');
      result = result.filter(order => {
        const orderDate = dayjs(order.orderTime);
        return orderDate.isAfter(startDate) && orderDate.isBefore(endDate);
      });
    }

    setFilteredOrders(result);
    setPagination(prev => ({
      ...prev,
      total: result.length
    }));
  };

  const resetFilters = () => {
    setSearchText('');
    setSelectedStatus('');
    setDateRange(null);
    setFilteredOrders(orders);
  };

  const showOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsVisible(true);
  };

const showStatusUpdateModal = (order: Order) => {
  // Nếu đơn hàng đã giao, không cho phép cập nhật trạng thái
  if (order.orderStatus === 'DELIVERED') {
    message.info('Đơn hàng đã giao không thể thay đổi trạng thái');
    return;
  }
  
  setSelectedOrder(order);
  setNewStatus(order.orderStatus);
  setStatusModalVisible(true);
};

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) {
      return;
    }
      if (selectedOrder.orderStatus === 'DELIVERED') {
    message.info('Đơn hàng đã giao không thể thay đổi trạng thái');
    setStatusModalVisible(false);
    return;
  }

    setLoading(true);
    try {
      // Giả lập API call
      console.log(`Updating order ${selectedOrder.orderId} status to ${newStatus}`);
      const logisticService = new LogisticService();
      await logisticService.updateOrderStatus(selectedOrder.orderId.toString(), newStatus);
      setTimeout(() => {

        // Cập nhật state local
        const updatedOrders = orders.map(order =>
          order.orderId === selectedOrder.orderId ? { ...order, orderStatus: newStatus } : order
        );

        setOrders(updatedOrders);
        applyFilters();

        message.success('Cập nhật trạng thái đơn hàng thành công');
        setStatusModalVisible(false);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error updating order status:', error);
      message.error('Không thể cập nhật trạng thái đơn hàng');
      setLoading(false);
    }
  };

  // Hiển thị status tag với màu sắc tương ứng
  const renderStatusTag = (status: string) => {
    const statusInfo = statusSteps.find(s => s.status === status) || {
      title: status,
      color: 'default'
    };

    return <Tag color={statusInfo.color}>{statusInfo.title}</Tag>;
  };

  // Kiểm tra trạng thái thanh toán dựa trên paymentMethod
  const getPaymentStatus = (paymentMethod: string) => {
    // Đây là logic đơn giản, trong thực tế bạn cần dữ liệu thật về trạng thái thanh toán
    if (paymentMethod === 'COD') return { color: 'gold', text: 'Chờ thanh toán' };
    return { color: 'green', text: 'Đã thanh toán' };
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 100,
      render: (id: number) => <span>{id}</span>
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderTime',
      key: 'orderTime',
      width: 120,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      render: (amount: number) => <span>{amount}</span> // `${amount.toLocaleString('vi-VN')} ₫` 
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 150,
      render: (method: string) => {
        const status = getPaymentStatus(method);
        return (
          <div>
            <div>{method}</div>
            <Tag color={status.color}>{status.text}</Tag>
          </div>
        );
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 120,
      render: renderStatusTag
    },
{
  title: 'Thao tác',
  key: 'action',
  width: 150,
  render: (_: any, record: Order) => (
    <Space size="small">
      <Button
        type="primary"
        size="small"
        onClick={() => showStatusUpdateModal(record)}
        disabled={record.orderStatus === 'DELIVERED'} // Vô hiệu hóa nút nếu đơn hàng đã giao
      >
        Cập nhật
      </Button>
      <Button
        size="small"
        icon={<InfoCircleOutlined />}
        onClick={() => showOrderDetails(record)}
      >
        Chi tiết
      </Button>
    </Space>
  )
}
  ];

  return (
    <div className="order-management">
      <Card title={<Title level={4}>Quản Lý Đơn Hàng</Title>} bordered={false}>
        <div className="filter-section" style={{ marginBottom: 20 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={6}>
              <Input
                placeholder="Tìm theo mã đơn hoặc tên khách hàng"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
                allowClear
              />
            </Col>
            <Col xs={24} md={5}>
<Select
  placeholder="Lọc theo trạng thái"
  style={{ width: '100%' }}
  value={selectedStatus}
  onChange={value => setSelectedStatus(value)}
  allowClear
>
  {statusSteps.map(status => (
    <Option key={status.status} value={status.status}>
      {status.title}
    </Option>
  ))}
</Select>
            </Col>
            <Col xs={24} md={8}>
              <RangePicker
                style={{ width: '100%' }}
                value={dateRange}
                onChange={dates => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
                format="DD/MM/YYYY"
              />
            </Col>
            <Col xs={24} md={5}>
              <Button
                icon={<FilterOutlined />}
                onClick={resetFilters}
                style={{ marginRight: 8 }}
              >
                Xóa bộ lọc
              </Button>
              <Button
                type="primary"
                onClick={fetchOrders}
              >
                Làm mới
              </Button>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="orderId"
          loading={loading}
          pagination={{
            ...pagination,
            onChange: page => setPagination({ ...pagination, current: page })
          }}
        />
      </Card>

      {/* Modal cập nhật trạng thái */}
      <Modal
        title="Cập nhật trạng thái đơn hàng"
        open={statusModalVisible}
        onOk={handleStatusUpdate}
        onCancel={() => setStatusModalVisible(false)}
        confirmLoading={loading}
      >
        {selectedOrder && (
          <div>
            <p><strong>Mã đơn hàng:</strong> DH{selectedOrder.orderId.toString().padStart(6, '0')}</p>
            <p><strong>Khách hàng:</strong> {selectedOrder.customerName}</p>
            <p><strong>Trạng thái hiện tại:</strong> {renderStatusTag(selectedOrder.orderStatus)}</p>

            <Divider />

            <div>
              <p><strong>Chọn trạng thái mới:</strong></p>
              <Select
                style={{ width: '100%' }}
                value={newStatus}
                onChange={value => setNewStatus(value)}
              >
                {statusSteps.map(status => (
                  <Option key={status.status} value={status.status} disabled={status.status === selectedOrder.orderStatus}>
                    <Space>
                      {status.icon}
                      {status.title}
                    </Space>
                  </Option>
                ))}
                {/* <Option value="CANCELLED" disabled={selectedOrder.orderStatus === 'DELIVERED'}>
                  <Space>
                    <Badge status="error" />
                    Đã hủy
                  </Space>
                </Option> */}
              </Select>
            </div>
          </div>
        )}
      </Modal>

      {/* Drawer chi tiết đơn hàng */}
      <Drawer
        title={`Chi tiết đơn hàng ${selectedOrder?.orderId.toString()}`}
        placement="right"
        width={600}
        onClose={() => setDetailsVisible(false)}
        open={detailsVisible}
      >
        {selectedOrder && (
          <div>
            <Descriptions title="Thông tin đơn hàng" bordered column={1}>
              <Descriptions.Item label="Khách hàng">{selectedOrder.customerName}</Descriptions.Item>
              <Descriptions.Item label="Điện thoại">{selectedOrder.phoneNumber}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng">{selectedOrder.address}</Descriptions.Item>
              <Descriptions.Item label="Ngày đặt hàng">{dayjs(selectedOrder.orderTime).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
              {selectedOrder.deliveryDate && (
                <Descriptions.Item label="Ngày giao hàng">{dayjs(selectedOrder.deliveryDate).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
              )}
              <Descriptions.Item label="Phương thức thanh toán">{selectedOrder.paymentMethod}</Descriptions.Item>
<Descriptions.Item label="Trạng thái đơn hàng">
  {renderStatusTag(selectedOrder.orderStatus)}
  {selectedOrder.orderStatus === 'DELIVERED' && (
    <div style={{ marginTop: 8 }}>
      <Typography.Text type="secondary" italic>
        (Đơn hàng đã giao không thể thay đổi trạng thái)
      </Typography.Text>
    </div>
  )}
</Descriptions.Item>
              <Descriptions.Item label="Tổng số sản phẩm">{selectedOrder.totalQuantity}</Descriptions.Item>
              {selectedOrder.note && (
                <Descriptions.Item label="Ghi chú">{selectedOrder.note}</Descriptions.Item>
              )}
            </Descriptions>

            <Divider orientation="left">Sản phẩm trong đơn hàng</Divider>

            <Table
              dataSource={selectedOrder.orderProducts}
              rowKey="productId"
              pagination={false}
              columns={[
                {
                  title: 'Sản phẩm',
                  dataIndex: 'productName',
                  key: 'productName',
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'quantity',
                  key: 'quantity',
                  width: 100,
                },
                {
                  title: 'Đơn giá',
                  dataIndex: 'price',
                  key: 'price',
                  width: 150,
                  render: (price: number) => <span>{price}</span> //`${price.toLocaleString('vi-VN')} ₫`
                },
                {
                  title: 'Thành tiền',
                  dataIndex: 'total',
                  key: 'total',
                  width: 150,
                  render: (price: number) => <span>{price}</span> //`${price.toLocaleString('vi-VN')} ₫`
                }
              ]}
              summary={() => (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3} align="right">
                      <strong>Tổng tiền hàng:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <strong>{selectedOrder.subtotal.toLocaleString('vi-VN')} ₫</strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3} align="right">
                      <strong>Phí vận chuyển:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <strong>{selectedOrder.shippingFee.toLocaleString('vi-VN')} ₫</strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3} align="right">
                      <strong>Tổng thanh toán:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <strong>{selectedOrder.total.toLocaleString('vi-VN')} ₫</strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </div>
        )}
      </Drawer>
    </div >
  );
};

export default OrderManagement;
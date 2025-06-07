import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Card, Spin, Alert, Button, Modal, Badge, List, Typography,
  Space, Row, Col, Statistic, Avatar, Breadcrumb, Divider, Tag,
  Table, Tabs, Empty, Descriptions
} from 'antd'
import {
  HomeOutlined, PhoneOutlined, UserOutlined, ClockCircleOutlined,
  MailOutlined, DollarOutlined, EnvironmentOutlined, ArrowLeftOutlined,
  ShoppingOutlined, CheckCircleOutlined, FileTextOutlined, SyncOutlined, GiftOutlined, CarOutlined, ExclamationCircleOutlined, SwapOutlined, RollbackOutlined
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface Order {
  id: number;
  orderTime: string;
  total: number;
  orderStatus: string;
}

interface Customer {
  id: number
  fullName: string
  phone: string
  totalSpending: number
  email: string
  avatar: string
  orders: Order[]
}

interface Address {
  id: number
  fullName: string
  phoneNumber: string
  address: string
  city: string
  enable: boolean
  default: boolean
}

// Enhanced styles for better space utilization
const styles = `
  body, html, #root, .ant-layout, .ant-layout-content {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .customer-detail-container {
    width: 100%;
    padding: 24px;
    box-sizing: border-box;
    background-color: #f0f2f5;
    min-height: 100vh;
  }
  
  .customer-profile-card {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    height: 100%;
  }
  
  .customer-avatar-container {
    margin-bottom: 20px;
    text-align: center;
  }
  
  .customer-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid white;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  }
  
  .customer-stats {
    background-color: #f9f9ff;
    padding: 16px;
    border-radius: 8px;
    margin-top: 16px;
  }
  
  .customer-info-card {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
  }
  
  .info-item {
    display: flex;
    margin-bottom: 16px;
  }
  
  .info-icon {
    margin-right: 12px;
    font-size: 20px;
    color: #1890ff;
  }
  
  .address-item {
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 12px;
    transition: all 0.2s;
  }
  
  .address-default {
    background-color: #f6ffed;
    border: 1px solid #b7eb8f;
  }
  
  .address-normal {
    background-color: white;
    border: 1px solid #f0f0f0;
  }
  
  .address-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
  
  .divider-with-text {
    display: flex;
    align-items: center;
    margin: 16px 0;
    color: rgba(0, 0, 0, 0.45);
  }
  
  .divider-with-text:before,
  .divider-with-text:after {
    content: '';
    flex: 1;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  }
  
  .divider-with-text:before {
    margin-right: 16px;
  }
  
  .divider-with-text:after {
    margin-left: 16px;
  }
  
  .stats-card {
    background-color: #f9f9ff;
    border-radius: 8px;
    padding: 16px;
    text-align: center;
    margin-bottom: 16px;
  }
  
  .stats-value {
    font-size: 24px;
    font-weight: bold;
    color: #1890ff;
    margin: 8px 0;
  }
  
  .stats-label {
    color: #888;
    font-size: 14px;
  }
  
  .ant-tabs-nav {
    margin-bottom: 16px !important;
  }
`;

export default function CustomerDetail() {
  const { id } = useParams()
  const customerId = id ? parseInt(id, 10) : NaN
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('1')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderModalVisible, setOrderModalVisible] = useState(false)

  // Add styles to document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Fetch customer data
  useEffect(() => {
    if (isNaN(customerId)) {
      setError("ID khách hàng không hợp lệ.")
      setLoading(false)
      return
    }

    axios.get(`http://localhost:8080/api/saleperson/customers/${customerId}`)
      .then(res => {
        setCustomer(res.data)
        setLoading(false)
        fetchAddresses(false)
      })
      .catch(() => {
        setError("Không thể tải dữ liệu khách hàng.")
        setLoading(false)
      })
  }, [customerId])

  const fetchAddresses = (showModal = true) => {
    axios.get(`http://localhost:8080/api/addresses/customer/${customerId}`)
      .then(res => {
        setAddresses(res.data)
        if (showModal) {
          setIsModalVisible(true)
        }
      })
      .catch(error => {
        console.error("Error fetching addresses:", error);
        setAddresses([])
        if (showModal) {
          setIsModalVisible(true)
        }
      })
  }

  const getImageUrl = (avatarPath: string | undefined) => {
    if (!avatarPath) return undefined;
    return avatarPath.startsWith('http') ? avatarPath : `http://localhost:8080/images/avatars/${avatarPath}`;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const getStatusTag = (status: string) => {
    let color = '';
    let text = '';
    let icon = null;

    switch (status) {
      case 'NEW':
        color = 'blue';
        text = 'Mới';
        icon = <ClockCircleOutlined />;
        break;
      case 'PAID':
        color = 'cyan';
        text = 'Đã thanh toán';
        icon = <DollarOutlined />;
        break;
      case 'PROCCESSING':
        color = 'purple';
        text = 'Đang xử lý';
        icon = <SyncOutlined spin />;
        break;
      case 'PACKAGED':
        color = 'geekblue';
        text = 'Đã đóng gói';
        icon = <GiftOutlined />;
        break;
      case 'PICKED':
        color = 'blue';
        text = 'Đã lấy hàng';
        icon = <CheckCircleOutlined />;
        break;
      case 'SHIPPING':
        color = 'orange';
        text = 'Đang giao hàng';
        icon = <CarOutlined />;
        break;
      case 'DELIVERED':
        color = 'green';
        text = 'Đã giao hàng';
        icon = <CheckCircleOutlined />;
        break;
      case 'RETURN_REQUESTED':
        color = 'volcano';
        text = 'Yêu cầu trả hàng';
        icon = <ExclamationCircleOutlined />;
        break;
      case 'RETURNED':
        color = 'red';
        text = 'Đã trả hàng';
        icon = <SwapOutlined />;
        break;
      case 'REFUNDED':
        color = 'magenta';
        text = 'Đã hoàn tiền';
        icon = <RollbackOutlined />;
        break;
      default:
        color = 'default';
        text = status;
    }

    return <Tag color={color} icon={icon}>{text}</Tag>;
  };

  const showOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setOrderModalVisible(true);
  };

  const orderColumns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => {
        const order = customer?.orders.find(o => o.id === id);
        return order ? <a onClick={() => showOrderDetail(order)}>{`#${id}`}</a> : null;
      },
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderTime',
      key: 'orderTime',
      render: (date: string) => formatDate(date),
      sorter: (a: Order, b: Order) =>
        new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime(),
      defaultSortOrder: 'descend' as const
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => <Text strong>{total.toLocaleString()}₫</Text>,
      sorter: (a: Order, b: Order) => a.total - b.total,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: 'Mới', value: 'NEW' },
        { text: 'Đã thanh toán', value: 'PAID' },
        { text: 'Đang xử lý', value: 'PROCCESSING' },
        { text: 'Đã đóng gói', value: 'PACKAGED' },
        { text: 'Đã lấy hàng', value: 'PICKED' },
        { text: 'Đang giao hàng', value: 'SHIPPING' },
        { text: 'Đã giao hàng', value: 'DELIVERED' },
        { text: 'Yêu cầu trả hàng', value: 'RETURN_REQUESTED' },
        { text: 'Đã trả hàng', value: 'RETURNED' },
        { text: 'Đã hoàn tiền', value: 'REFUNDED' }
      ],
      onFilter: (value: unknown, record: Order) => record.orderStatus === value,
    },
  ];

  // Calculate order statistics
  const getOrderStats = () => {
    if (!customer?.orders) return {
      total: 0,
      new: 0,
      paid: 0,
      processing: 0,
      packaged: 0,
      picked: 0,
      shipping: 0,
      delivered: 0,
      returnRequested: 0,
      returned: 0,
      refunded: 0
    };

    return {
      total: customer.orders.length,
      new: customer.orders.filter(o => o.orderStatus === 'NEW').length,
      paid: customer.orders.filter(o => o.orderStatus === 'PAID').length,
      processing: customer.orders.filter(o => o.orderStatus === 'PROCCESSING').length,
      packaged: customer.orders.filter(o => o.orderStatus === 'PACKAGED').length,
      picked: customer.orders.filter(o => o.orderStatus === 'PICKED').length,
      shipping: customer.orders.filter(o => o.orderStatus === 'SHIPPING').length,
      delivered: customer.orders.filter(o => o.orderStatus === 'DELIVERED').length,
      returnRequested: customer.orders.filter(o => o.orderStatus === 'RETURN_REQUESTED').length,
      returned: customer.orders.filter(o => o.orderStatus === 'RETURNED').length,
      refunded: customer.orders.filter(o => o.orderStatus === 'REFUNDED').length
    };
  };

  const orderStats = getOrderStats();

  if (loading) {
    return (
      <div className="customer-detail-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Đang tải thông tin khách hàng...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-detail-container" style={{ maxWidth: 800, margin: '0 auto', paddingTop: 40 }}>
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          action={
            <Button type="primary">
              <Link to="/shop/customers">Quay lại danh sách</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="customer-detail-container">
      <Breadcrumb
        style={{ marginBottom: '16px' }}
        items={[
          { title: <Link to="/shop/dashboard">Trang chủ</Link> },
          { title: <Link to="/shop/customers">Quản lý khách hàng</Link> },
          { title: customer?.fullName || `Khách hàng #${customerId}` },
        ]}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          <UserOutlined /> {customer?.fullName}
        </Title>
        <Button type="primary" icon={<ArrowLeftOutlined />}>
          <Link to="/shop/customers" style={{ color: 'white' }}>Quay lại danh sách</Link>
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left column - Customer profile */}
        <Col xs={24} lg={7}>
          <Card className="customer-profile-card" bordered={false}>
            <div className="customer-avatar-container">
              {customer?.avatar ? (
                <img
                  src={getImageUrl(customer.avatar)}
                  alt={customer.fullName}
                  className="customer-avatar"
                />
              ) : (
                <Avatar
                  size={120}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1890ff' }}
                />
              )}
              <Title level={3} style={{ marginTop: 16, marginBottom: 4 }}>
                {customer?.fullName}
              </Title>
              <Tag color="blue">Mã KH: {customer?.id}</Tag>
            </div>

            <div className="divider-with-text">Thông tin liên hệ</div>

            <div style={{ padding: '0 8px 16px' }}>
              <div className="info-item" style={{ marginBottom: 12 }}>
                <PhoneOutlined className="info-icon" style={{ fontSize: 16 }} />
                <div>
                  <div style={{ color: '#888', marginBottom: 4, fontSize: 13 }}>Số điện thoại</div>
                  <div style={{ fontSize: 15 }}>{customer?.phone || 'Chưa cập nhật'}</div>
                </div>
              </div>

              <div className="info-item" style={{ marginBottom: 0 }}>
                <MailOutlined className="info-icon" style={{ fontSize: 16 }} />
                <div>
                  <div style={{ color: '#888', marginBottom: 4, fontSize: 13 }}>Email</div>
                  <div style={{ fontSize: 15 }}>{customer?.email || 'Chưa cập nhật'}</div>
                </div>
              </div>
            </div>

            <div className="customer-stats">
              <Statistic
                title={<span style={{ fontSize: 15 }}><DollarOutlined /> Tổng chi tiêu</span>}
                value={customer?.totalSpending || 0}
                precision={0}
                formatter={(value) => `${value?.toLocaleString()}₫`}
                valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
              />
            </div>

            <div className="divider-with-text">Tổng quan đơn hàng</div>

            <Row gutter={[12, 12]}>
              <Col span={12}>
                <div className="stats-card">
                  <ShoppingOutlined style={{ fontSize: 22, color: '#1890ff' }} />
                  <div className="stats-value">{orderStats.total}</div>
                  <div className="stats-label">Tổng đơn hàng</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="stats-card">
                  <CheckCircleOutlined style={{ fontSize: 22, color: '#52c41a' }} />
                  <div className="stats-value">{orderStats.delivered}</div>
                  <div className="stats-label">Đã giao hàng</div>
                </div>
              </Col>
            </Row>

            <Divider style={{ margin: '20px 0' }} />

          </Card>
        </Col>

        {/* Right column - Detailed information and orders */}
        <Col xs={24} lg={17}>
          <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
            <TabPane tab={<span><UserOutlined /> Thông tin cơ bản</span>} key="1">
              <Card className="customer-info-card" bordered={false}>
                <div style={{ padding: '16px 8px' }}>
                  <Row gutter={[24, 0]}>
                    <Col xs={24} md={12}>
                      <div className="info-item">
                        <UserOutlined className="info-icon" />
                        <div>
                          <div style={{ color: '#888', marginBottom: 4 }}>Họ tên</div>
                          <div style={{ fontSize: 16, fontWeight: 500 }}>{customer?.fullName}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <MailOutlined className="info-icon" />
                        <div>
                          <div style={{ color: '#888', marginBottom: 4 }}>Email</div>
                          <div style={{ fontSize: 16 }}>{customer?.email || 'Chưa cập nhật'}</div>
                        </div>
                      </div>
                    </Col>

                    <Col xs={24} md={12}>
                      <div className="info-item">
                        <PhoneOutlined className="info-icon" />
                        <div>
                          <div style={{ color: '#888', marginBottom: 4 }}>Số điện thoại</div>
                          <div style={{ fontSize: 16 }}>{customer?.phone || 'Chưa cập nhật'}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <DollarOutlined className="info-icon" />
                        <div>
                          <div style={{ color: '#888', marginBottom: 4 }}>Tổng chi tiêu</div>
                          <div style={{ fontSize: 16, fontWeight: 500, color: '#3f8600' }}>
                            {customer?.totalSpending?.toLocaleString()}₫
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card>

              <Card
                className="customer-info-card"
                bordered={false}
                title="Địa chỉ giao hàng"
                extra={
                  addresses.length > 0 && (
                    <Button type="link" onClick={() => fetchAddresses(true)} style={{ padding: 0 }}>
                      Xem tất cả
                    </Button>
                  )
                }
              >
                {addresses.length > 0 ? (
                  <List
                    itemLayout="vertical"
                    dataSource={addresses.slice(0, 2)}
                    renderItem={(item) => (
                      <List.Item
                        className={`address-item ${item.default ? 'address-default' : 'address-normal'}`}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                              <UserOutlined style={{ marginRight: 8 }} />
                              <Text strong>{item.fullName}</Text>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                              <PhoneOutlined style={{ marginRight: 8 }} />
                              <Text>{item.phoneNumber}</Text>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                              <EnvironmentOutlined style={{ marginRight: 8, marginTop: 4 }} />
                              <div>
                                <Text>{item.address}</Text>
                                {item.city && (
                                  <div>
                                    <Text type="secondary">{item.city}</Text>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {item.default && (
                            <Badge.Ribbon text="Mặc định" color="green">
                              <div style={{ width: 20, height: 20 }}></div>
                            </Badge.Ribbon>
                          )}
                        </div>
                      </List.Item>
                    )}
                  />
                ) : (
                  <div style={{ padding: '30px 0', textAlign: 'center' }}>
                    <EnvironmentOutlined style={{ fontSize: 36, color: '#d9d9d9' }} />
                    <Paragraph style={{ marginTop: 16 }}>
                      Khách hàng chưa có địa chỉ giao hàng nào
                    </Paragraph>
                    <Button onClick={() => fetchAddresses(true)}>Tải lại dữ liệu</Button>
                  </div>
                )}
              </Card>

            </TabPane>

            <TabPane tab={<span><ShoppingOutlined /> Lịch sử đơn hàng</span>} key="2">
              <Card bordered={false} className="customer-info-card">
                <div style={{ marginBottom: 16 }}>
                  <Space>
                    <Text>Tổng số:</Text>
                    <Tag color="blue">{orderStats.total} đơn hàng</Tag>
                    <Divider type="vertical" />
                    <Tag color="blue" icon={<ClockCircleOutlined />}>Mới: {orderStats.new}</Tag>
                    <Tag color="orange" icon={<DollarOutlined />}>Đã thanh toán: {orderStats.paid}</Tag>
                    <Tag color="green" icon={<CheckCircleOutlined />}>Đã giao: {orderStats.delivered}</Tag>
                  </Space>
                </div>

                <Table
                  dataSource={customer?.orders || []}
                  columns={orderColumns}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} đơn hàng`
                  }}
                />
              </Card>
            </TabPane>
          </Tabs>
        </Col>
      </Row>

      {/* Address Modal */}
      <Modal
        title={
          <Space align="center">
            <HomeOutlined />
            <span>Địa chỉ giao hàng của {customer?.fullName}</span>
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        {addresses.length > 0 ? (
          <List
            itemLayout="vertical"
            dataSource={addresses}
            renderItem={(item) => (
              <List.Item
                className={`address-item ${item.default ? 'address-default' : 'address-normal'}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <UserOutlined style={{ marginRight: '8px' }} />
                      <Text strong>{item.fullName}</Text>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <PhoneOutlined style={{ marginRight: '8px' }} />
                      <Text>{item.phoneNumber}</Text>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <EnvironmentOutlined style={{ marginRight: '8px', marginTop: '4px' }} />
                      <div>
                        <Text>{item.address}</Text>
                        {item.city && (
                          <div>
                            <Text type="secondary">{item.city}</Text>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {item.default && (
                    <Badge.Ribbon text="Mặc định" color="green">
                      <div style={{ width: 20, height: 20 }}></div>
                    </Badge.Ribbon>
                  )}
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Alert
            message="Không có địa chỉ giao hàng nào"
            description="Khách hàng này chưa có địa chỉ giao hàng nào được lưu trong hệ thống."
            type="warning"
            showIcon
          />
        )}
      </Modal>

      {/* Order Detail Modal */}
      <Modal
        title={
          <Space align="center">
            <FileTextOutlined />
            <span>Chi tiết đơn hàng #{selectedOrder?.id}</span>
          </Space>
        }
        open={orderModalVisible}
        onCancel={() => setOrderModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setOrderModalVisible(false)}>
            Đóng
          </Button>,
          <Button key="link" type="primary">
            <Link to={`/orders/${selectedOrder?.id}`} style={{ color: 'white' }}>
              Xem đầy đủ
            </Link>
          </Button>,
        ]}
        width={600}
      >
        {selectedOrder && (
          <div>
            <Descriptions title="Thông tin đơn hàng" bordered column={1}>
              <Descriptions.Item label="Mã đơn hàng">#{selectedOrder.id}</Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">{formatDate(selectedOrder.orderTime)}</Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <Text strong>{selectedOrder.total.toLocaleString()}₫</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {getStatusTag(selectedOrder.orderStatus)}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Text type="secondary">Để xem chi tiết đơn hàng, vui lòng nhấn "Xem đầy đủ"</Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
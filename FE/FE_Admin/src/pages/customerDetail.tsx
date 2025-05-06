import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { 
  Card, Descriptions, Spin, Alert, Button, Modal, Badge, List, Typography, 
  Space, Row, Col, Statistic, Avatar, Breadcrumb, Divider, Tag
} from 'antd'
import { 
  HomeOutlined, CheckCircleFilled, PhoneOutlined, UserOutlined,
  MailOutlined, DollarOutlined, EnvironmentOutlined, ArrowLeftOutlined
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography;

interface Customer {
  id: number
  fullName: string
  phone: string
  totalSpending: number
  email: string
  avatar: string
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

// Add styles for full-width layout and better design
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
`;

export default function CustomerDetail() {
  const { id } = useParams()
  const customerId = id ? parseInt(id, 10) : NaN
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)

  // Add styles to document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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
      })
      .catch(() => {
        setError("Không thể tải dữ liệu khách hàng.")
        setLoading(false)
      })
  }, [customerId])

  const fetchAddresses = () => {
    axios.get(`http://localhost:8080/api/addresses/customer/${customerId}`)
      .then(res => {
        setAddresses(res.data)
        setIsModalVisible(true)
      })
      .catch(error => {
        console.error("Error fetching addresses:", error);
        setAddresses([])
        setIsModalVisible(true)
      })
  }

  const getImageUrl = (avatarPath: string | undefined) => {
    if (!avatarPath) return undefined;
    return avatarPath.startsWith('http') ? avatarPath : `http://localhost:8080/images/avatars/${avatarPath}`;
  };

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
              <Link to="/customers">Quay lại danh sách</Link>
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
          { title: <Link to="/dashboard">Trang chủ</Link> },
          { title: <Link to="/customers">Quản lý khách hàng</Link> },
          { title: customer?.fullName || `Khách hàng #${customerId}` },
        ]}
      />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          <UserOutlined /> Thông tin khách hàng
        </Title>
        <Button type="primary" icon={<ArrowLeftOutlined />}>
          <Link to="/customers" style={{ color: 'white' }}>Quay lại danh sách</Link>
        </Button>
      </div>
      
      <Row gutter={[24, 24]}>
        {/* Left column - Avatar and summary */}
        <Col xs={24} md={8}>
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
            
            <Divider />
            
            <div className="customer-stats">
              <Statistic
                title={<span style={{ fontSize: 16 }}><DollarOutlined /> Tổng chi tiêu</span>}
                value={customer?.totalSpending || 0}
                precision={0}
                formatter={(value) => `${value?.toLocaleString()}₫`}
                valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
              />
            </div>
            
            <Divider />
            
            <Button 
              type="primary" 
              icon={<HomeOutlined />}
              onClick={fetchAddresses}
              block
              size="large"
              style={{ marginBottom: 16 }}
            >
              Xem địa chỉ giao hàng
            </Button>
          </Card>
        </Col>
        
        {/* Right column - Detailed information */}
        <Col xs={24} md={16}>
          <Card className="customer-info-card" bordered={false} title="Thông tin chi tiết">
            <div style={{ padding: '16px 8px' }}>
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
            </div>
          </Card>
          
        </Col>
      </Row>

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
    </div>
  )
}
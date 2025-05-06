import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, Descriptions, Spin, Alert, Button, Modal, Tag, List, Typography, Space, Badge } from 'antd'
import { HomeOutlined, CheckCircleFilled, PhoneOutlined, UserOutlined } from '@ant-design/icons'

const { Text } = Typography;

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

export default function CustomerDetail() {
  const { id } = useParams()
  const customerId = id ? parseInt(id, 10) : NaN
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)

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
    console.log(`Fetching addresses for customerId: ${customerId}`);
    axios.get(`http://localhost:8080/api/addresses/customer/${customerId}`)
      .then(res => {
        console.log("Addresses:", res.data);
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

  if (loading) return <Spin tip="Đang tải dữ liệu..." />
  if (error) return <Alert type="error" message={error} />

  return (
    <>
      <Card
        title={`Thông tin khách hàng: ${customer?.fullName}`}
        style={{ maxWidth: 600, margin: "auto" }}
        extra={<Button onClick={fetchAddresses} type="primary">Xem địa chỉ giao hàng</Button>}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Họ tên">{customer?.fullName}</Descriptions.Item>
          <Descriptions.Item label="Email">{customer?.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{customer?.phone}</Descriptions.Item>
          <Descriptions.Item label="Tổng chi tiêu">{customer?.totalSpending?.toLocaleString()}₫</Descriptions.Item>
          <Descriptions.Item label="Ảnh đại diện">
            {customer?.avatar ? (
              <img 
                src={getImageUrl(customer.avatar)} 
                alt="avatar" 
                width={100} 
                style={{ borderRadius: '50%' }}
              />
            ) : (
              "Chưa có ảnh"
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal
        title={
          <Space align="center">
            <HomeOutlined />
            <span>Địa chỉ giao hàng của khách hàng</span>
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
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  backgroundColor: item.default ? '#f6ffed' : 'white',
                  border: item.default ? '1px solid #b7eb8f' : '1px solid #f0f0f0'
                }}
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
                      <HomeOutlined style={{ marginRight: '8px', marginTop: '4px' }} />
                      <Text>{item.address}</Text>
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
    </>
  )
}
import { useEffect, useState } from 'react';
import axios from '../axios.customize';
import { 
  Table, Card, Input, Button, Space, Tag, Typography, 
  Row, Col, Statistic, Breadcrumb, Spin,
  message, Alert, Avatar, Tooltip
} from 'antd';
import { 
  SearchOutlined, ReloadOutlined, UserOutlined, 
  TeamOutlined, DollarOutlined, ShoppingOutlined,
  EyeOutlined, HistoryOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import type { TableProps } from 'antd';

const { Title, Text } = Typography;

interface Customer {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
  totalSpending: number;
  avatar?: string;
}

// Add CSS to handle responsive styling
const styles = `
  /* Make sure the entire application container is full width */
  body, html, #root, .ant-layout, .ant-layout-content {
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow-x: hidden;
  }
  
  /* Fix customer container to be truly full width */
  .customer-fullwidth-container {
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 !important;
    padding: 24px !important;
    box-sizing: border-box !important;
    background-color: #f0f2f5;
    min-height: 100vh;
  }
  
  @media (max-width: 576px) {
    .action-col {
      margin-top: 16px;
    }
  }
`;

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [statistics, setStatistics] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    totalSpending: 0
  });

  // Add styles to document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
  
      const userData = localStorage.getItem('user');
      const shopId = userData ? JSON.parse(userData).id : null;
  
      if (!shopId) {
        throw new Error('Không tìm thấy shopId');
      }
  
      const response = await axios.get(`/saleperson/customers?shopId=${shopId}`);
      const data = response.data;
      setCustomers(data);
      setFilteredCustomers(data);
  
      const totalSpending = data.reduce((sum: number, customer: Customer) =>
        sum + (customer.totalSpending || 0), 0);
  
      setStatistics({
        totalCustomers: data.length,
        activeCustomers: data.filter((c: Customer) => c.totalSpending > 0).length,
        totalSpending: totalSpending
      });
  
      message.success('Đã tải dữ liệu khách hàng thành công');
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Không thể tải dữ liệu khách hàng');
      message.error('Không thể tải dữ liệu khách hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter(customer => 
      customer.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      (customer.phone?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
      customer.id.toString().includes(searchText)
    );
    setFilteredCustomers(filtered);
  }, [searchText, customers]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleTableChange: TableProps<Customer>['onChange'] = (pagination, filters, sorter) => {
    console.log('Table parameters:', pagination, filters, sorter);
    // Handle any additional sorting or filtering
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleRefresh = () => {
    fetchCustomers();
  };

  const getAvatarUrl = (avatarPath: string | undefined) => {
    if (!avatarPath) return undefined;
    return avatarPath.startsWith('http') 
      ? avatarPath 
      : `http://localhost:8080/images/avatars/${avatarPath}`;
  };

  const columns = [
    {
      title: 'Mã KH',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: Customer, b: Customer) => a.id - b.id,
      width: 80,
    },
    {
      title: 'Khách hàng',
      key: 'fullName',
      render: (_: any, record: Customer) => (
        <Space>
          <Avatar 
            src={getAvatarUrl(record.avatar)} 
            icon={<UserOutlined />} 
          />
          <Link to={`/shop/customers/${record.id}`}>
            <Text strong>{record.fullName}</Text>
          </Link>
        </Space>
      ),
      sorter: (a: Customer, b: Customer) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || '-'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => email || '-',
      responsive: ['md' as const],
    },
    {
      title: 'Tổng chi tiêu',
      dataIndex: 'totalSpending',
      key: 'totalSpending',
      render: (value: number) => {
        const formattedValue = value ? value.toLocaleString() + '₫' : '0₫';
        
        let color = '';
        if (value > 10000000) color = 'green';
        else if (value > 1000000) color = 'blue';
        else if (value > 0) color = 'gray';
        
        return value > 0 ? (
          <Tag color={color} style={{fontSize: '14px'}}>
            {formattedValue}
          </Tag>
        ) : formattedValue;
      },
      sorter: (a: Customer, b: Customer) => (a.totalSpending || 0) - (b.totalSpending || 0),
      defaultSortOrder: 'descend' as const,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Customer) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Link to={`/shop/customers/${record.id}`}>
              <Button type="primary" size="small" icon={<EyeOutlined />} />
            </Link>
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={handleRefresh}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="customer-fullwidth-container">
    <Breadcrumb
      style={{ marginBottom: '16px' }}
      items={[
        { title: <Link to="/">Trang chủ</Link> },
        { title: 'Quản lý khách hàng' },
      ]}
    />
      
      <Title level={2} style={{ marginBottom: '24px' }}>
        <TeamOutlined /> Quản lý khách hàng
      </Title>
      
      {/* Statistical Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng khách hàng"
              value={statistics.totalCustomers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Khách hàng đã mua hàng"
              value={statistics.activeCustomers}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={statistics.totalSpending}
              prefix={<DollarOutlined />}
              suffix="₫"
              valueStyle={{ color: '#faad14' }}
              formatter={(value) => `${value?.toLocaleString()}`}
            />
          </Card>
        </Col>
      </Row>
      
      <Card bordered={false} bodyStyle={{ padding: '1px 0px 0px 0px' }}>
        <Card
          bordered={false}
          style={{ marginBottom: '16px' }}
          bodyStyle={{ padding: '20px 24px' }}
        >
          <Row justify="space-between" align="middle">
            <Col xs={24} sm={16} md={12}>
              <Input
                placeholder="Tìm kiếm khách hàng theo tên, số điện thoại, mã..."
                prefix={<SearchOutlined />}
                onChange={handleSearch}
                value={searchText}
                style={{ width: '100%' }}
                allowClear
              />
            </Col>
            <Col xs={24} sm={8} md={12} style={{ textAlign: 'right' }} className="action-col">
              <Tooltip title="Làm mới dữ liệu">
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={handleRefresh}
                  loading={loading}
                />
              </Tooltip>
            </Col>
          </Row>
        </Card>
        
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredCustomers}
          rowSelection={rowSelection}
          onChange={handleTableChange}
          loading={loading}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,  // Disable size changer to remove "10/page"
            showTotal: () => null,        // Hide the total text
            locale: { items_per_page: '' } // Remove "/ page" text
          }}
          scroll={{ x: 'max-content' }}
          style={{ marginTop: '8px' }}
          bordered
          size="middle"
        />
      </Card>
    </div>
  );
};

export default Customers;
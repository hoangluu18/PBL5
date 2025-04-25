import { useState } from 'react';
import { Layout, Table, Input, Button, Menu, Checkbox, Typography, Row, Col, Card, Dropdown } from 'antd';
import {
    PlusOutlined,
    DownOutlined,
    StarOutlined,
    CalendarOutlined,
    RightOutlined,
    PrinterOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;
const { Search } = Input;
const { Text, Title } = Typography;

const InvoiceManagementPage = () => {
    const [collapsed, setCollapsed] = useState(false);

    document.title = 'Quản lý hóa đơn';
    // Sample invoice data
    const invoices = [
        {
            key: '1',
            star: false,
            invoiceId: 'HD000049',
            date: '03/03/2025 20:54',
            productId: 'TH000001',
            customer: 'Khách lẻ',
            totalAmount: 90000,
            discount: 0,
            finalAmount: 90000,
        },
        {
            key: '2',
            star: false,
            invoiceId: 'HD000048',
            date: '03/03/2025 20:54',
            productId: '',
            customer: 'Khách lẻ',
            totalAmount: 70000,
            discount: 0,
            finalAmount: 70000,
        },
        {
            key: '3',
            star: false,
            invoiceId: 'HD000047',
            date: '03/03/2025 20:54',
            productId: '',
            customer: 'Khách lẻ',
            totalAmount: 10100,
            discount: 0,
            finalAmount: 10100,
        },
    ];

    // Calculate totals
    const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
    const totalDiscount = invoices.reduce((sum, invoice) => sum + invoice.discount, 0);
    const totalFinalAmount = invoices.reduce((sum, invoice) => sum + invoice.finalAmount, 0);

    const columns = [
        {
            title: '',
            dataIndex: 'checkbox',
            key: 'checkbox',
            width: 40,
            render: () => <Checkbox />,
        },
        {
            title: '',
            dataIndex: 'star',
            key: 'star',
            width: 40,
            render: () => <StarOutlined style={{ color: '#d9d9d9' }} />,
        },
        {
            title: 'Mã hóa đơn',
            dataIndex: 'invoiceId',
            key: 'invoiceId',
        },
        {
            title: 'Thời gian',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Mã từ hàng',
            dataIndex: 'productId',
            key: 'productId',
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customer',
            key: 'customer',
        },
        {
            title: 'Tổng tiền hàng',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            align: 'right',
        },
        {
            title: 'Giảm giá',
            dataIndex: 'discount',
            key: 'discount',
            align: 'right',
        },
        {
            title: 'Khách đã trả',
            dataIndex: 'finalAmount',
            key: 'finalAmount',
            align: 'right',
        },
    ];

    const footer = () => (
        <Row justify="space-between">
            <Col></Col>
            <Col>
                <Row gutter={16}>
                    <Col>Tổng:</Col>
                    <Col style={{ textAlign: 'right', width: 120 }}>{totalAmount.toLocaleString()}</Col>
                    <Col style={{ textAlign: 'right', width: 80 }}>{totalDiscount}</Col>
                    <Col style={{ textAlign: 'right', width: 120 }}>{totalFinalAmount.toLocaleString()}</Col>
                </Row>
            </Col>
        </Row>
    );

    // Common card style with improved spacing and borders
    const cardStyle = {
        marginBottom: 8,
        borderRadius: 4,
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
    };

    return (
        <div className='container'>
            <Layout style={{ minHeight: '100vh' }}>
                <Layout>
                    {/* Left sidebar with improved spacing */}
                    <Sider
                        width={250}
                        theme="light"
                        style={{
                            borderRight: '1px solid #f0f0f0',
                            padding: '8px',
                            backgroundColor: '#f9f9f9',
                            overflowY: 'auto'
                        }}
                    >
                        <Card
                            bordered={true}
                            bodyStyle={{ padding: '8px 0' }}
                            style={cardStyle}
                        >
                            <Title level={5} style={{ padding: '0 16px', marginBottom: 8 }}>Thời gian</Title>
                            <Menu
                                mode="vertical"
                                selectable
                                defaultSelectedKeys={['today']}
                                style={{ border: 'none' }}
                            >
                                <Menu.Item key="today" icon={<CalendarOutlined />}>Tháng này</Menu.Item>
                                <Menu.Item key="custom" icon={<CalendarOutlined />}>Lựa chọn khác</Menu.Item>
                            </Menu>
                        </Card>

                        <Card
                            bordered={true}
                            bodyStyle={{ padding: '8px 0' }}
                            style={cardStyle}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px' }}>
                                <Title level={5}>Trạng thái</Title>
                                <RightOutlined />
                            </div>
                            <div style={{ padding: '0 16px' }}>
                                <div>Chọn phương thức bán hàng...</div>
                            </div>
                            <Menu mode="vertical" style={{ border: 'none' }}>
                                <Menu.Item key="active">
                                    <Checkbox>Đang xử lý</Checkbox>
                                </Menu.Item>
                                <Menu.Item key="completed">
                                    <Checkbox>Hoàn thành</Checkbox>
                                </Menu.Item>
                                <Menu.Item key="pending">
                                    <Checkbox>Không giao được</Checkbox>
                                </Menu.Item>
                                <Menu.Item key="canceled">
                                    <Checkbox>Đã hủy</Checkbox>
                                </Menu.Item>
                            </Menu>
                        </Card>

                        <Card
                            bordered={true}
                            bodyStyle={{ padding: '8px 0' }}
                            style={cardStyle}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px' }}>
                                <Title level={5}>Trạng thái giao hàng</Title>
                                <RightOutlined />
                            </div>
                            <Menu mode="vertical" style={{ border: 'none' }}>
                                <Menu.Item key="pending-delivery">
                                    <Checkbox>Chờ xử lý</Checkbox>
                                </Menu.Item>
                                <Menu.Item key="delivering">
                                    <Checkbox>Lấy hàng</Checkbox>
                                    <Button type="text" size="small">+</Button>
                                </Menu.Item>
                                <Menu.Item key="delivered">
                                    <Checkbox>Giao hàng</Checkbox>
                                    <Button type="text" size="small">+</Button>
                                </Menu.Item>
                                <Menu.Item key="completed-delivery">
                                    <Checkbox>Giao thành công</Checkbox>
                                </Menu.Item>
                                <Menu.Item key="transfer">
                                    <Checkbox>Chuyển hoàn</Checkbox>
                                    <Button type="text" size="small">+</Button>
                                </Menu.Item>
                                <Menu.Item key="returned">
                                    <Checkbox>Đã chuyển hoàn</Checkbox>
                                </Menu.Item>
                                <Menu.Item key="canceled-delivery">
                                    <Checkbox>Đã hủy</Checkbox>
                                </Menu.Item>
                            </Menu>
                        </Card>

                        <Card
                            bordered={true}
                            bodyStyle={{ padding: '8px 0' }}
                            style={cardStyle}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px' }}>
                                <Title level={5}>Đối tác giao hàng</Title>
                                <RightOutlined />
                            </div>
                            <div style={{ padding: '0 16px' }}>
                                <div>Chọn người giao...</div>
                            </div>
                        </Card>

                        <Card
                            bordered={true}
                            bodyStyle={{ padding: '8px 0' }}
                            style={cardStyle}
                        >
                            <Title level={5} style={{ padding: '0 16px', marginBottom: 8 }}>Thời gian giao hàng</Title>
                            <Menu
                                mode="vertical"
                                selectable
                                style={{ border: 'none' }}
                            >
                                <Menu.Item key="delivery-today" icon={<CalendarOutlined />}>Toàn thời gian</Menu.Item>
                                <Menu.Item key="delivery-custom" icon={<CalendarOutlined />}>Lựa chọn khác</Menu.Item>
                            </Menu>
                        </Card>

                        <Card
                            bordered={true}
                            bodyStyle={{ padding: '8px 0' }}
                            style={cardStyle}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px' }}>
                                <Title level={5}>Khu vực giao hàng</Title>
                                <RightOutlined />
                            </div>
                            <div style={{ padding: '0 16px' }}>
                                <div>Chọn Tỉnh/TP - Quận/huyện</div>
                            </div>
                        </Card>

                        <Card
                            bordered={true}
                            bodyStyle={{ padding: '8px 0' }}
                            style={cardStyle}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px' }}>
                                <Title level={5}>Phương thức</Title>
                                <RightOutlined />
                            </div>
                            <div style={{ padding: '0 16px' }}>
                                <div>Chọn phương thức thanh toán...</div>
                            </div>
                        </Card>
                    </Sider>

                    {/* Main content */}
                    <Content style={{ padding: '0', background: '#fff' }}>
                        <div style={{ padding: '16px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                            <Title level={5} style={{ margin: 0 }}>Hóa đơn</Title>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Search
                                    placeholder="Theo mã hóa đơn"
                                    style={{ width: 200, marginRight: 8 }}
                                    suffix={<DownOutlined />}
                                />
                                <Button type="primary" icon={<PlusOutlined />} style={{ marginRight: 8 }}>
                                    Thêm mới
                                </Button>
                                <Button icon={<PrinterOutlined />} style={{ marginRight: 8 }}>
                                    Gộp đơn
                                </Button>
                                <Dropdown overlay={<Menu items={[]} />} placement="bottomRight">
                                    <Button icon={<DownOutlined />}>
                                        File
                                    </Button>
                                </Dropdown>
                                <Button type="text" style={{ marginLeft: 8 }}>=</Button>
                            </div>
                        </div>

                        <Table
                            columns={columns}
                            dataSource={invoices}
                            pagination={false}
                            size="small"
                            rowClassName={() => 'invoice-row'}
                            footer={footer}
                            bordered
                        />
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
};

export default InvoiceManagementPage;
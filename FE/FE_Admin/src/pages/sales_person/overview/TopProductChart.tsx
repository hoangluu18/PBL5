import { Card, Typography, Row, Col, Dropdown, Menu, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

const TopProductsChart = () => {
    // Sample data for the chart - we only see 2 products in the image
    const productData = [
        {
            name: 'Ldn nắch boss gold to 50ml',
            value: 17000000
        },
        {
            name: 'Dây Pond hồng',
            value: 2000000
        },
        // Placeholder entries to make it top 10 (these would be replaced with real data)
        { name: 'Product 3', value: 0 },
        { name: 'Product 4', value: 0 },
        { name: 'Product 5', value: 0 },
        { name: 'Product 6', value: 0 },
        { name: 'Product 7', value: 0 },
        { name: 'Product 8', value: 0 },
        { name: 'Product 9', value: 0 },
        { name: 'Product 10', value: 0 }
    ];

    const formatXAxis = (value: any) => {
        if (value >= 1000000) {
            return `${value / 1000000} tr`;
        } else if (value >= 1000) {
            return `${value / 1000} k`;
        }
        return value;
    };

    const revenueMenu = (
        <Menu>
            <Menu.Item key="1">THEO DOANH THU THUẦN</Menu.Item>
            <Menu.Item key="2">THEO SỐ LƯỢNG BÁN</Menu.Item>
            <Menu.Item key="3">THEO LỢI NHUẬN</Menu.Item>
        </Menu>
    );

    const timeMenu = (
        <Menu>
            <Menu.Item key="1">Tháng này</Menu.Item>
            <Menu.Item key="2">Tháng trước</Menu.Item>
            <Menu.Item key="3">3 tháng gần đây</Menu.Item>
        </Menu>
    );

    return (
        <Card style={{ borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Title level={5} style={{ margin: 0 }}>TOP 10 HÀNG HÓA BÁN CHẠY THÁNG NÀY</Title>
                </Col>
                <Col>
                    <Row align="middle">
                        <Dropdown overlay={revenueMenu}>
                            <Button type="primary" style={{ marginRight: 10 }}>
                                THEO DOANH THU THUẦN <DownOutlined />
                            </Button>
                        </Dropdown>
                        <Dropdown overlay={timeMenu}>
                            <Button style={{ border: 'none', boxShadow: 'none' }}>
                                <DownOutlined />
                            </Button>
                        </Dropdown>
                    </Row>
                </Col>
            </Row>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={productData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={formatXAxis}
                        domain={[0, 'dataMax + 1000000']}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        width={100}
                    />
                    <Bar
                        dataKey="value"
                        fill="#1890ff"
                        barSize={20}
                        radius={[0, 4, 4, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>

            <div style={{ textAlign: 'right', marginTop: 8 }}>
                <Text style={{ color: '#1890ff', cursor: 'pointer' }}>Tháng này</Text>
            </div>
        </Card>
    );
};

export default TopProductsChart;
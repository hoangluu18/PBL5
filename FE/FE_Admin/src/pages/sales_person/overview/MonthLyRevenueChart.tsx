import { useState } from 'react';
import { Card, Tabs, Typography, Row, Col, Dropdown, Menu, Button } from 'antd';
import { DownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const MonthlyRevenueChart = () => {
    const [activeTab, setActiveTab] = useState('daily');

    // Sample data for the chart
    const dailyData = [
        { day: '01', revenue: 900000 },
        { day: '02', revenue: 250000 },
        { day: '03', revenue: 300000 },
        { day: '04', revenue: 1200000 },
        { day: '05', revenue: 450000 },
        { day: '06', revenue: 1200000 },
        { day: '07', revenue: 850000 },
        { day: '08', revenue: 200000 },
        { day: '09', revenue: 650000 },
        { day: '10', revenue: 1100000 },
        { day: '11', revenue: 1150000 },
        { day: '12', revenue: 1200000 },
        { day: '13', revenue: 400000 },
        { day: '14', revenue: 1100000 },
        { day: '15', revenue: 300000 },
        { day: '16', revenue: 900000 },
        { day: '17', revenue: 400000 },
        { day: '18', revenue: 1050000 },
        { day: '19', revenue: 1300000 },
        { day: '20', revenue: 500000 },
        { day: '21', revenue: 800000 },
        { day: '22', revenue: 600000 },
        { day: '23', revenue: 300000 },
        { day: '24', revenue: 400000 },
        { day: '25', revenue: 1200000 },
        { day: '26', revenue: 450000 },
        { day: '27', revenue: 650000 },
    ];

    const formatYAxis = (value: any) => {
        if (value >= 1000000) {
            return `${value / 1000000} tr`;
        } else if (value >= 1000) {
            return `${value / 1000}k`;
        }
        return value;
    };

    const menu = (
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
                    <Row align="middle">
                        <Title level={5} style={{ margin: 0, marginRight: 8 }}>DOANH THU THUẦN THÁNG NÀY</Title>
                        <InfoCircleOutlined style={{ color: '#bfbfbf' }} />
                    </Row>
                </Col>
                <Col>
                    <Row align="middle">
                        <Title level={4} style={{ margin: 0, marginRight: 12, color: '#1890ff' }}>19,765,000</Title>
                        <Dropdown overlay={menu}>
                            <Button style={{ border: 'none', boxShadow: 'none' }}>
                                <DownOutlined />
                            </Button>
                        </Dropdown>
                    </Row>
                </Col>
            </Row>

            <Tabs defaultActiveKey="daily" onChange={setActiveTab}>
                <TabPane tab="Theo ngày" key="daily" />
                <TabPane tab="Theo giờ" key="hourly" />
                <TabPane tab="Theo thứ" key="weekday" />
            </Tabs>

            <ResponsiveContainer width="100%" height={250}>
                <BarChart
                    data={dailyData}
                    margin={{ top: 10, right: 0, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        tickFormatter={formatYAxis}
                    />
                    <Bar
                        dataKey="revenue"
                        fill="#1890ff"
                        barSize={16}
                        radius={[2, 2, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>

            <div style={{ textAlign: 'right', marginTop: 8 }}>
                <Text style={{ color: '#1890ff', cursor: 'pointer' }}>Tháng này</Text>
            </div>
        </Card>
    );
};

export default MonthlyRevenueChart;
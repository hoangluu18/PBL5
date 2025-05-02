import { useState } from 'react';
import { Card, Radio, Space, Typography } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';

const { Title } = Typography;

export default function WeekdayChart() {
    const [chartType, setChartType] = useState('bar');

    // Dữ liệu mẫu theo thứ trong tuần
    const data = [
        { day: 'Thứ Hai', sales: 1200, visitors: 400 },
        { day: 'Thứ Ba', sales: 1500, visitors: 500 },
        { day: 'Thứ Tư', sales: 1000, visitors: 350 },
        { day: 'Thứ Năm', sales: 1800, visitors: 600 },
        { day: 'Thứ Sáu', sales: 2200, visitors: 700 },
        { day: 'Thứ Bảy', sales: 2500, visitors: 800 },
        { day: 'Chủ Nhật', sales: 1700, visitors: 550 },
    ];

    const renderChart = () => {
        if (chartType === 'bar') {
            return (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#1677ff" name="Doanh thu" />
                        <Bar dataKey="visitors" fill="#52c41a" name="Lượt truy cập" />
                    </BarChart>
                </ResponsiveContainer>
            );
        } else {
            return (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="sales" stroke="#1677ff" name="Doanh thu" />
                        <Line type="monotone" dataKey="visitors" stroke="#52c41a" name="Lượt truy cập" />
                    </LineChart>
                </ResponsiveContainer>
            );
        }
    };

    return (
        <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={4}>Doanh thu theo ngày trong tuần</Title>
                    <Radio.Group
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                        buttonStyle="solid"
                    >
                        <Radio.Button value="bar">Biểu đồ cột</Radio.Button>
                        <Radio.Button value="line">Biểu đồ đường</Radio.Button>
                    </Radio.Group>
                </div>
                {renderChart()}
            </Space>
        </Card>
    );
}
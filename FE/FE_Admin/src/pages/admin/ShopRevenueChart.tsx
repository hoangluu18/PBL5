import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, Radio, Space } from 'antd';
import { ShopRevenue } from '../../models/AdminDto';
import AdminService from '../../services/admin/admin.service';

import dayjs from 'dayjs';

interface ShopRevenueChartProps {
    selectedDate: dayjs.Dayjs;  // Add this prop
}

export default function ShopRevenueChart({ selectedDate }: ShopRevenueChartProps) {

    const [data, setData] = useState<ShopRevenue[]>();

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const fetchData = async () => {
        try {
            const adminService = new AdminService();
            const result = await adminService.getShopRevenue(selectedDate.format('YYYY-MM'));
            setData(result);
        } catch (error) {
            console.error('Error fetching shop revenue data:', error);
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    const [chartType, setChartType] = useState('bar');

    const formatCurrency = (value: any) => {
        return `${value.toLocaleString()} đ`;
    };


    return (
        <Card title="Thống kê Doanh thu Cửa hàng" className="shadow-md mt-3">
            <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ textAlign: 'right', marginBottom: '16px' }}>
                    <Radio.Group
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                        buttonStyle="solid"
                    >
                        <Radio.Button value="bar">Biểu đồ Cột</Radio.Button>
                        <Radio.Button value="pie">Biểu đồ Tròn</Radio.Button>
                    </Radio.Group>
                </div>

                {/* Chart container with explicit dimensions */}
                <div style={{ width: '100%', height: 400, border: '0px solid #eee' }}>
                    {chartType === 'bar' ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis
                                    tickFormatter={formatCurrency}
                                    domain={[0, 'dataMax + 20000']}
                                />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="revenue" name="Doanh thu" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="revenue"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </Space>
        </Card>
    );
}
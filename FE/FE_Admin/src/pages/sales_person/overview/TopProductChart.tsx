import { DatePicker, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { TopProductDto } from '../../../models/DashboardDto';
import DashboardService from '../../../services/dashboard';
import { AuthContext } from '../../../utils/auth.context';
import dayjs, { Dayjs } from 'dayjs';

const { Title } = Typography;

export default function TopProductsChart() {

    const [data, setData] = useState<TopProductDto[]>()
    const { user } = useContext(AuthContext)
    const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs()) // Ngày hiện tại;

    useEffect(() => {
        fetchData();
    }, [selectedMonth]);

    const fetchData = async () => {
        try {
            const dashboardService = new DashboardService();
            const response = await dashboardService.getTopProduct(user?.id, selectedMonth.format('YYYY-MM'))
            setData(response)
        } catch (error) {
            console.error("Error fetching top products data:", error);
        }
    }


    // Hàm xử lý khi chọn tháng/năm
    const handleMonthChange = (date: Dayjs) => {
        setSelectedMonth(date);
    };

    // Hàm format số thành triệu VNĐ
    const formatCurrency = (value: number) => {
        return `${(value / 1_000_000).toFixed(1)} triệu`;
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md w-full">
            <Title level={4}>Top 10 Sản phẩm bán nhiều nhất</Title>
            <DatePicker
                picker="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                format="YYYY/MM"
                style={{ marginBottom: '20px' }}
            />
            {/* Cực kỳ quan trọng: phải có height! */}
            <div style={{ width: '100%', height: 600 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 30, bottom: 70 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="productName"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            stroke="#8884d8"
                            label={{
                                value: 'Số lượng bán ra',
                                angle: -90,
                                position: 'middleLeft',
                                dx: -20
                            }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#82ca9d"
                            label={{
                                value: 'Doanh thu (triệu VNĐ)',
                                angle: 90,
                                position: 'middleRight"',
                                dx: 30
                            }}
                            tickFormatter={formatCurrency}
                        />
                        <Tooltip
                            formatter={(value, name) => {
                                if (name === 'Doanh thu') {
                                    return [`${(Number(value) / 1_000_000).toFixed(1)} triệu VNĐ`, name];
                                }
                                return [value, name];
                            }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Bar yAxisId="left" dataKey="totalAmount" name="Số lượng bán ra" fill="#8884d8" />
                        <Bar yAxisId="right" dataKey="totalRevenue" name="Doanh thu" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

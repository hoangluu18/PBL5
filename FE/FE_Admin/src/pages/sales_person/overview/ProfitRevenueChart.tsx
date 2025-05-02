import { useContext, useEffect, useState } from 'react';
import { Card, Select, Space, Typography, DatePicker, Switch } from 'antd';
import {
    Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart
} from 'recharts';
import DashboardService from '../../../services/dashboard';
import { AuthContext } from '../../../utils/auth.context';
import { ReportDto } from '../../../models/DashboardDto';
import type { DatePickerProps } from 'antd';
import type { Dayjs } from 'dayjs';
const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function ProfitRevenueChart() {
    const [data, setData] = useState<ReportDto[]>([]); // Dữ liệu động từ API
    const { user } = useContext(AuthContext);
    const [timeRange, setTimeRange] = useState('1_week_ago'); // Phạm vi thời gian
    const [showNetRevenue, setShowNetRevenue] = useState(true); // Hiển thị lợi nhuận
    const [startDate, setStartDate] = useState<string | null>(null); // Ngày bắt đầu
    const [endDate, setEndDate] = useState<string | null>(null); // Ngày kết thúc

    // Lấy dữ liệu từ API khi timeRange thay đổi
    useEffect(() => {
        fetchReportData();
    }, [timeRange]);

    useEffect(() => {
        fetchReportDataByDateRange();
    }, [startDate, endDate]);

    // Hàm gọi API để lấy dữ liệu
    const fetchReportData = async () => {
        try {
            const dashBoardService = new DashboardService();
            const response = await dashBoardService.getStatisticByXDaysOrXMonths(user?.id, timeRange);

            // Xử lý dữ liệu để thêm netRevenue (lợi nhuận)
            const processedData = response.map((item: ReportDto) => ({
                ...item,
                netRevenue: item.netProfit, // Thêm lợi nhuận vào dữ liệu
                day: item.identifier,
                orders: item.totalOrder,
                grossRevenue: item.grossRevenue,
            }));

            setData(processedData);
        } catch (error) {
            console.error("Error fetching report data:", error);
        }
    };

    const fetchReportDataByDateRange = async () => {
        try {
            const dashBoardService = new DashboardService();
            if (!startDate || !endDate) {
                console.error("Start date or end date is null");
                return;
            }
            const response = await dashBoardService.getStatisticByDateRange(user?.id, startDate, endDate);
            // Xử lý dữ liệu để thêm netRevenue (lợi nhuận)
            const processedData = response.map((item: ReportDto) => ({
                ...item,
                netRevenue: item.netProfit,
                day: item.identifier,
                orders: item.totalOrder,
                grossRevenue: item.grossRevenue,
            }));

            setData(processedData);
        } catch (error) {
            console.error("Error fetching report data:", error);
        }
    };

    // Hàm định dạng số tiền
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(value);
    };
    const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();
    const disabled30DaysDate: DatePickerProps['disabledDate'] = (current, { from, type }) => {
        if (from) {
            const minDate = from.add(-6, 'days');
            const maxDate = from.add(6, 'days');

            switch (type) {
                case 'year':
                    return current.year() < minDate.year() || current.year() > maxDate.year();

                case 'month':
                    return (
                        getYearMonth(current) < getYearMonth(minDate) ||
                        getYearMonth(current) > getYearMonth(maxDate)
                    );

                default:
                    return Math.abs(current.diff(from, 'days')) >= 30;
            }
        }

        return false;
    };

    const handleRangeDate = (dates: any, dateStrings: [string, string]) => {
        if (dates) {
            setStartDate(dateStrings[0]); // Ngày bắt đầu
            setEndDate(dateStrings[1]);
            console.log("Start date:", dateStrings[0], "End date:", dateStrings[1]);
        } else {
            setStartDate(null);
            setEndDate(null);
        }
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: '#fff',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
                    <p style={{ margin: 0, color: '#1677ff' }}>
                        Số đơn hàng: {payload[0]?.value}
                    </p>
                    <p style={{ margin: 0, color: '#ff7a45' }}>
                        Doanh thu thuần: {formatCurrency(payload[1]?.value)}
                    </p>
                    {showNetRevenue && (
                        <p style={{ margin: 0, color: '#52c41a' }}>
                            Lợi nhuận: {formatCurrency(payload[2]?.value)}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={4}>Số đơn hàng, doanh thu và lợi nhuận</Title>
                    <Space>
                        <span>Hiển thị lợi nhuận:</span>
                        <Switch
                            checked={showNetRevenue}
                            onChange={checked => setShowNetRevenue(checked)}
                        />
                        <Select
                            defaultValue="1_week_ago"
                            style={{ width: 120 }}
                            onChange={value => setTimeRange(value)}
                        >
                            <Option value="1_week_ago">1 tuần trước</Option>
                            <Option value="1_month_ago">1 tháng trước</Option>
                            <Option value="6_months_ago">6 tháng trước</Option>
                            <Option value="1_year_ago">1 năm trước</Option>
                        </Select>
                        <RangePicker onChange={handleRangeDate} disabledDate={disabled30DaysDate} />
                    </Space>
                </div>

                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />

                        {/* Trục Y bên trái cho số đơn hàng */}
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            label={{ value: 'Số đơn hàng', angle: -90, position: 'insideLeft' }}
                        />

                        {/* Trục Y bên phải cho doanh thu */}
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tickFormatter={(value) => `${value / 1000}K`}
                            label={{ value: 'Doanh thu (VNĐ)', angle: 90, position: 'insideRight' }}
                        />

                        <Tooltip content={<CustomTooltip />} />
                        <Legend />

                        {/* Biểu đồ cột cho số đơn hàng */}
                        <Bar
                            yAxisId="left"
                            dataKey="orders"
                            fill="#1677ff"
                            name="Số đơn hàng"
                            barSize={40}
                        />

                        {/* Biểu đồ đường cho doanh thu gộp */}
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="grossRevenue"
                            stroke="#ff7a45"
                            name="Doanh thu thuần"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />

                        {/* Biểu đồ đường cho lợi nhuận (hiển thị tùy theo switch) */}
                        {showNetRevenue && (
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="netRevenue"
                                stroke="#52c41a"
                                name="Lợi nhuận"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                strokeDasharray="5 5"
                            />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </Space>
        </Card>
    );
}
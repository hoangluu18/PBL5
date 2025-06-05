import { useEffect, useState } from 'react';
import { Card, Row, Col, Progress, Tabs, Typography, Tag, Statistic, Spin, Empty, Button } from 'antd';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AdminService from '../../services/admin/admin.service';
import { ShopStatistic } from '../../models/AdminDto';

const { Title, Text } = Typography;
const COLORS = ['#00C49F', '#FF8042', '#FFBB28', '#0088FE', '#8884d8'];

interface OrderRateChartProps {
    selectedDate: dayjs.Dayjs;
}

const OrderRateChart = ({ selectedDate }: OrderRateChartProps) => {
    const [shopData, setShopData] = useState<ShopStatistic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [selectedDate]); // Re-fetch when date changes

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const adminService = new AdminService();
            const formattedDate = selectedDate.format('YYYY-MM');

            console.log(`Fetching shop statistics for: ${formattedDate}`);
            const result = await adminService.getShopStatistic(formattedDate);

            if (Array.isArray(result)) {
                setShopData(result);
            } else {
                console.error('Expected array data from API');
                setShopData([]);
            }
        } catch (error) {
            console.error('Error fetching shop statistic data:', error);
            setError('Không thể tải dữ liệu thống kê cửa hàng');
            setShopData([]);
        } finally {
            setLoading(false);
        }
    };

    // Safely calculate statistics only if we have data
    const totalShops = shopData?.length || 0;
    const totalOrders = shopData?.reduce((sum, shop) => sum + shop.totalOrders, 0) || 0;
    const totalCompletedOrders = shopData?.reduce((sum, shop) => sum + shop.completedOrders, 0) || 0;
    const totalCanceledOrders = shopData?.reduce((sum, shop) => sum + shop.canceledOrders, 0) || 0;
    const totalFailedOrders = shopData?.reduce((sum, shop) => sum + shop.failedOrders, 0) || 0;

    // Format currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(value);
    };

    // Create tabs for detailed order rates
    const orderRatesTabs = shopData?.map(shop => {
        // Calculate completion rate if not provided
        const completionRate = shop.completionRate ||
            (shop.totalOrders > 0 ? (shop.completedOrders / shop.totalOrders * 100) : 0);

        const pieData = [
            { name: "Thành công", value: shop.completedOrders, color: '#00C49F' },
            { name: "Thất bại", value: shop.failedOrders, color: '#FF8042' },
            { name: "Đã hủy", value: shop.canceledOrders, color: '#FFBB28' }
        ];

        return {
            key: shop.id,
            label: shop.shopName,
            children: (
                <Card>
                    <Row gutter={16}>
                        <Col span={12}>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value} đơn hàng`, '']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Col>
                        <Col span={12}>
                            <div className="p-4">
                                <Title level={4}>Thống kê đơn hàng</Title>

                                <Row gutter={[16, 16]} className="mt-4">
                                    <Col span={12}>
                                        <Statistic
                                            title="Tổng đơn hàng"
                                            value={shop.totalOrders}
                                            suffix="đơn"
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic
                                            title="Doanh thu"
                                            value={formatCurrency(shop.revenue)}
                                            valueStyle={{ color: '#3f8600' }}
                                        />
                                    </Col>
                                </Row>

                                <div className="mt-6 space-y-4">
                                    <div>
                                        <Text strong>Tỷ lệ thành công:</Text> <Text>
                                            {shop.totalOrders > 0
                                                ? (shop.completedOrders / shop.totalOrders * 100).toFixed(2)
                                                : 0}%
                                        </Text>
                                        <Tag color="green" className="ml-2">
                                            <CheckCircleOutlined /> {shop.completedOrders} đơn
                                        </Tag>
                                    </div>
                                    <div>
                                        <Text strong>Tỷ lệ thất bại:</Text> <Text>
                                            {shop.totalOrders > 0
                                                ? (shop.failedOrders / shop.totalOrders * 100).toFixed(2)
                                                : 0}%
                                        </Text>
                                        <Tag color="red" className="ml-2">
                                            <CloseCircleOutlined /> {shop.failedOrders} đơn
                                        </Tag>
                                    </div>
                                    <div>
                                        <Text strong>Tỷ lệ hủy:</Text> <Text>
                                            {shop.totalOrders > 0
                                                ? (shop.canceledOrders / shop.totalOrders * 100).toFixed(2)
                                                : 0}%
                                        </Text>
                                        <Tag color="orange" className="ml-2">
                                            <ExclamationCircleOutlined /> {shop.canceledOrders} đơn
                                        </Tag>
                                    </div>

                                    <div className="mt-4">
                                        <Text strong>Tỷ lệ hoàn thành tổng thể:</Text>
                                        <Progress
                                            percent={parseFloat(completionRate.toFixed(1))}
                                            status={completionRate >= 85 ? 'success' : 'normal'}
                                            strokeColor={completionRate >= 85 ? '#52c41a' :
                                                (completionRate >= 70 ? '#1890ff' : '#faad14')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card>
            )
        };
    });

    // Summary card to show overall statistics
    const summaryCard = (
        <Card className="mb-4 shadow-sm">
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Statistic
                        title="Tổng cửa hàng"
                        value={totalShops}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Statistic
                        title="Tổng đơn hàng"
                        value={totalOrders}
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Statistic
                        title="Đơn hàng thành công"
                        value={totalCompletedOrders}
                        valueStyle={{ color: '#3f8600' }}
                        suffix={totalOrders > 0 ?
                            <span style={{ fontSize: '14px', color: '#8c8c8c' }}>
                                {`(${(totalCompletedOrders / totalOrders * 100).toFixed(1)}%)`}
                            </span> : null}
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Statistic
                        title="Đơn hàng hủy/thất bại"
                        value={totalCanceledOrders + totalFailedOrders}
                        valueStyle={{ color: '#cf1322' }}
                        suffix={totalOrders > 0 ?
                            <span style={{ fontSize: '14px', color: '#8c8c8c' }}>
                                {`(${((totalCanceledOrders + totalFailedOrders) / totalOrders * 100).toFixed(1)}%)`}
                            </span> : null}
                    />
                </Col>
            </Row>
        </Card>
    );

    if (loading) {
        return (
            <Card className="shadow-md mt-3">
                <div className="flex justify-center items-center" style={{ height: "400px" }}>
                    <Spin tip="Đang tải dữ liệu..." />
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="shadow-md mt-3">
                <div className="flex justify-center items-center flex-col" style={{ height: "300px" }}>
                    <Text type="danger">{error}</Text>
                    <Button onClick={fetchData} type="primary" className="mt-4">
                        Thử lại
                    </Button>
                </div>
            </Card>
        );
    }

    if (!shopData || shopData.length === 0) {
        return (
            <Card className="shadow-md mt-3">
                <Empty
                    description="Không có dữ liệu thống kê cho thời gian này"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </Card>
        );
    }

    return (
        <div className="mt-3">
            {summaryCard}

            <Card
                title={`Chi tiết tỷ lệ đơn hàng theo cửa hàng - ${selectedDate.format('MMMM YYYY')}`}
                className="shadow-md"
            >
                <Tabs items={orderRatesTabs} />
            </Card>
        </div>
    );
};

export default OrderRateChart;
import { useContext, useEffect, useState } from 'react';
import { Card, List, Typography, Avatar, Spin, Empty } from 'antd';
import { ShoppingOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import OrderService from '../../../services/order.service';
import { AuthContext } from '../../../utils/auth.context';
import { RecentOrdersDto } from '../../../models/OrderDto';

const { Title, Text } = Typography;

const ActivityNotifications = () => {
    const [recentOrders, setRecentOrders] = useState<RecentOrdersDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user?.id) {
            fetchRecentOrders();
        }
    }, [user]);

    const fetchRecentOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const orderService = new OrderService();
            const recentOrders = await orderService.getRecentOrders(user?.id);
            console.log('Recent Orders:', recentOrders);
            setRecentOrders(recentOrders || []);
        } catch (error) {
            console.error('Error fetching recent orders:', error);
            setError('Không thể tải dữ liệu hoạt động gần đây');
        } finally {
            setLoading(false);
        }
    };

    // Hàm format thời gian tương đối được cải thiện
    const getRelativeTime = (orderTime: string): string => {
        try {
            if (!orderTime) {
                return 'Thời gian không xác định';
            }

            // Chuyển đổi string thành Date object
            const orderDate = new Date(orderTime);
            
            // Kiểm tra tính hợp lệ của ngày
            if (isNaN(orderDate.getTime())) {
                console.warn('Invalid date format:', orderTime);
                return 'Thời gian không hợp lệ';
            }

            const now = new Date();
            const diffInMs = now.getTime() - orderDate.getTime();
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            // Xử lý thời gian tương đối
            if (diffInMinutes < 1) {
                return 'Vừa xong';
            } else if (diffInMinutes < 60) {
                return `${diffInMinutes} phút trước`;
            } else if (diffInHours < 24) {
                return `${diffInHours} giờ trước`;
            } else if (diffInDays < 30) {
                return `${diffInDays} ngày trước`;
            } else {
                // Hiển thị ngày cụ thể nếu quá 30 ngày
                return orderDate.toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            }
        } catch (error) {
            console.error('Error parsing date:', error);
            return 'Lỗi thời gian';
        }
    };

    // Hàm render icon theo trạng thái đơn hàng
    const renderIcon = (status: string) => {
        const iconStyle = { fontSize: '16px' };
        
        switch (status) {
            case 'NEW':
                return (
                    <Avatar style={{ backgroundColor: '#1890ff' }}>
                        <ShoppingOutlined style={iconStyle} />
                    </Avatar>
                );
            case 'PROCESSING':
                return (
                    <Avatar style={{ backgroundColor: '#faad14' }}>
                        <ClockCircleOutlined style={iconStyle} />
                    </Avatar>
                );
            case 'SHIPPED':
                return (
                    <Avatar style={{ backgroundColor: '#722ed1' }}>
                        <ShoppingOutlined style={iconStyle} />
                    </Avatar>
                );
            case 'DELIVERED':
                return (
                    <Avatar style={{ backgroundColor: '#52c41a' }}>
                        <CheckCircleOutlined style={iconStyle} />
                    </Avatar>
                );
            case 'CANCELLED':
            case 'RETURN_REQUESTED':
                return (
                    <Avatar style={{ backgroundColor: '#f5222d' }}>
                        <ExclamationCircleOutlined style={iconStyle} />
                    </Avatar>
                );
            default:
                return (
                    <Avatar style={{ backgroundColor: '#d9d9d9' }}>
                        <ShoppingOutlined style={iconStyle} />
                    </Avatar>
                );
        }
    };

    // Hàm lấy text mô tả trạng thái
    const getOrderStatusText = (status: string): string => {
        const statusMap: Record<string, string> = {
            'NEW': 'đặt hàng mới',
            'PROCESSING': 'xác nhận đơn hàng',
            'SHIPPED': 'gửi hàng',
            'DELIVERED': 'nhận hàng thành công',
            'CANCELLED': 'hủy đơn hàng',
            'RETURN_REQUESTED': 'yêu cầu trả hàng',
            'REFUNDED': 'hoàn tiền'
        };
        
        return statusMap[status] || status.toLowerCase();
    };

    // Hàm format số tiền
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Render loading state
    if (loading) {
        return (
            <Card style={{ borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
                <Title level={5} style={{ margin: '16px 0' }}>CÁC HOẠT ĐỘNG GẦN ĐÂY</Title>
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 16 }}>Đang tải...</div>
                </div>
            </Card>
        );
    }

    // Render error state
    if (error) {
        return (
            <Card style={{ borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
                <Title level={5} style={{ margin: '16px 0' }}>CÁC HOẠT ĐỘNG GẦN ĐÂY</Title>
                <Empty 
                    description={error}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </Card>
        );
    }

    return (
        <Card style={{ borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            <Title level={5} style={{ margin: '16px 0' }}>
                CÁC HOẠT ĐỘNG GẦN ĐÂY
                {recentOrders.length > 0 && (
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 'normal', marginLeft: '8px' }}>
                        ({recentOrders.length} hoạt động)
                    </Text>
                )}
            </Title>

            {recentOrders.length === 0 ? (
                <Empty 
                    description="Chưa có hoạt động nào gần đây"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            ) : (
                <List
                    itemLayout="horizontal"
                    dataSource={recentOrders}
                    style={{ maxHeight: '400px', overflowY: 'auto' }}
                    renderItem={(item, index) => (
                        <List.Item 
                            key={`${item.orderId}-${index}`}
                            style={{ 
                                padding: '12px 0',
                                borderBottom: index === recentOrders.length - 1 ? 'none' : '1px solid #f0f0f0'
                            }}
                        >
                            <List.Item.Meta
                                avatar={renderIcon(item.orderStatus)}
                                title={
                                    <div style={{ marginBottom: '4px' }}>
                                        <Text strong style={{ color: '#1890ff' }}>
                                            {item.customerName || 'Khách hàng'}
                                        </Text>
                                        <Text> vừa {getOrderStatusText(item.orderStatus)}</Text>
                                        {item.total !== undefined && item.total > 0 && (
                                            <Text> với giá trị </Text>
                                        )}
                                        {item.total !== undefined && item.total > 0 && (
                                            <Text strong style={{ color: '#52c41a' }}>
                                                {formatCurrency(item.total)}
                                            </Text>
                                        )}
                                    </div>
                                }
                                description={
                                    <div>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            {getRelativeTime(item.orderTime)}
                                        </Text>
                                        {item.orderId && (
                                            <Text type="secondary" style={{ fontSize: '12px', marginLeft: '8px' }}>
                                                • Đơn hàng #{item.orderId}
                                            </Text>
                                        )}
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            )}
        </Card>
    );
};

export default ActivityNotifications;
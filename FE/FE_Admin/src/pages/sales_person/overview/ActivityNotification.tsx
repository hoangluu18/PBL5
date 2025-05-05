import { useContext, useEffect, useState } from 'react';
import { Card, List, Typography, Avatar } from 'antd';
import { ShoppingOutlined, PullRequestOutlined, CheckCircleOutlined } from '@ant-design/icons';
import OrderService from '../../../services/order.service';
import { AuthContext } from '../../../utils/auth.context';
import { RecentOrdersDto } from '../../../models/OrderDto';
import moment from 'moment';
import 'moment/locale/vi'; // Import locale tiếng Việt cho moment

// Cấu hình moment để sử dụng locale tiếng Việt
moment.locale('vi');
moment.updateLocale('vi', {
    relativeTime: {
        future: '%s trước',
        past: '%s trước',
        s: 'vài giây',
        ss: '%d giây',
        m: '1 phút',
        mm: '%d phút',
        h: '1 giờ',
        hh: '%d giờ',
        d: '1 ngày',
        dd: '%d ngày',
        M: '1 tháng',
        MM: '%d tháng',
        y: '1 năm',
        yy: '%d năm'
    }
});
const { Title, Text } = Typography;

const ActivityNotifications = () => {
    const [recentOrders, setRecentOrders] = useState<RecentOrdersDto[]>([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchRecentOrders();
    }, []);

    const fetchRecentOrders = async () => {
        try {
            const orderService = new OrderService();
            const recentOrders = await orderService.getRecentOrders(user?.id);
            console.log('Recent Orders:', recentOrders);
            setRecentOrders(recentOrders);
        }
        catch (error) {
            console.error('Error fetching recent orders:', error);
        }
    };

    // Hàm format thời gian tương đối sử dụng moment
    const getRelativeTime = (orderTime: string) => {
        try {
            // Debug: xem định dạng đầu vào
            console.log('Input orderTime:', orderTime);

            // Thử parse với nhiều định dạng khác nhau
            let orderDate;
            if (orderTime.includes('T') || orderTime.includes('Z')) {
                // Định dạng ISO
                orderDate = moment(orderTime);
            } else {
                // Thử các định dạng phổ biến
                const possibleFormats = [
                    'YYYY-MM-DD HH:mm:ss',
                    'DD/MM/YYYY HH:mm:ss',
                    'YYYY/MM/DD HH:mm:ss'
                ];
                orderDate = moment(orderTime, possibleFormats);
            }

            // Kiểm tra nếu ngày hợp lệ
            if (!orderDate.isValid()) {
                console.log('Invalid date format:', orderTime);
                return 'thời gian không xác định';
            }

            // Sử dụng fromNow() để hiển thị thời gian tương đối
            return orderDate.fromNow();
        } catch (error) {
            console.error('Error parsing date:', error);
            return 'thời gian không xác định';
        }
    };


    // Phần renderIcon và getOrderStatusText giữ nguyên
    const renderIcon = (status: string) => {
        if (status === 'RETURN_REQUESTED') {
            return <Avatar style={{ backgroundColor: '#f5222d' }}><PullRequestOutlined /></Avatar>;
        } else if (status === 'DELIVERED') {
            return <Avatar style={{ backgroundColor: '#52c41a' }}><CheckCircleOutlined /></Avatar>;
        }
        else {
            return <Avatar style={{ backgroundColor: '#1890ff' }}><ShoppingOutlined /></Avatar>;
        }
    };

    const getOrderStatusText = (status: string) => {
        switch (status) {
            case 'NEW':
                return 'đặt hàng';
            case 'PROCESSING':
                return 'xác nhận đơn hàng';
            case 'SHIPPED':
                return 'gửi hàng';
            case 'DELIVERED':
                return 'nhận hàng';
            case 'CANCELLED':
                return 'hủy đơn hàng';
            case 'RETURN_REQUESTED':
                return 'yêu cầu trả hàng';
            default:
                return status.toLowerCase();
        }
    };

    return (
        <Card style={{ borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            <Title level={5} style={{ margin: '16px 0' }}>CÁC HOẠT ĐỘNG GẦN ĐÂY</Title>

            <List
                itemLayout="horizontal"
                dataSource={recentOrders}
                renderItem={item => (
                    <List.Item style={{ padding: '8px 0' }}>
                        <List.Item.Meta
                            avatar={renderIcon(item.orderStatus)}
                            title={
                                <Text>
                                    <Text strong style={{ color: '#1890ff' }}>{item.customerName}</Text> vừa {getOrderStatusText(item.orderStatus)}{' '}
                                    {item.total !== undefined &&
                                        <Text>với giá trị {item.total.toLocaleString()} đ</Text>
                                    }
                                </Text>
                            }
                            description={<Text type="secondary">{getRelativeTime(item.orderTime)}</Text>}
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default ActivityNotifications;
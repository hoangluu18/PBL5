import { useState } from 'react';
import { Card, List, Typography, Badge, Avatar, Collapse } from 'antd';
import { CaretDownOutlined, ShoppingOutlined, LoginOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const ActivityNotifications = () => {
    const [expandedKeys, setExpandedKeys] = useState(['activities']);

    const activityData = [
        {
            user: 'Hoàng - Kinh Doanh',
            action: 'nhập hàng',
            value: '0',
            time: '27 phút trước',
            type: 'login'
        },
        {
            user: 'Hoàng - Kinh Doanh',
            action: 'bán đơn hàng',
            value: '103,000',
            time: '27 phút trước',
            type: 'order'
        },
        {
            user: 'Lưu Việt Hoàng',
            action: 'bán đơn hàng',
            value: '1,085,000',
            time: 'một ngày trước',
            type: 'order'
        },
        {
            user: 'Lưu Việt Hoàng',
            action: 'nhập hàng',
            value: '0',
            time: 'một ngày trước',
            type: 'login'
        },
        {
            user: 'Hoàng - Kinh Doanh',
            action: 'bán đơn hàng',
            value: '1,219,000',
            time: '2 ngày trước',
            type: 'order'
        },
        {
            user: 'Hoàng - Kinh Doanh',
            action: 'nhập hàng',
            value: '0',
            time: '2 ngày trước',
            type: 'login'
        },
        {
            user: 'Lưu Việt Hoàng',
            action: 'bán đơn hàng',
            value: '1,434,000',
            time: '3 ngày trước',
            type: 'order'
        },
        {
            user: 'Lưu Việt Hoàng',
            action: 'nhập hàng',
            value: '0',
            time: '3 ngày trước',
            type: 'login'
        },
        {
            user: 'Lưu Việt Hoàng',
            action: 'bán đơn hàng',
            value: '1,477,000',
            time: '4 ngày trước',
            type: 'order'
        }
    ];

    const renderIcon = (type: any) => {
        if (type === 'login') {
            return <Avatar style={{ backgroundColor: '#f5222d' }}><LoginOutlined /></Avatar>;
        } else {
            return <Avatar style={{ backgroundColor: '#1890ff' }}><ShoppingOutlined /></Avatar>;
        }
    };

    return (
        <Card style={{ borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            <Title level={5} style={{ margin: '0 0 16px 0' }}>THÔNG BÁO</Title>

            {/* Current Login Notification */}
            <div style={{ marginBottom: 16, borderBottom: '1px solid #f0f0f0', paddingBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Badge dot status="error" style={{ marginRight: 10 }} />
                    <div>
                        <Text>Có 1 hoạt động đăng nhập khác thường cần kiểm tra.</Text>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                            <CaretDownOutlined />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activities */}
            <Title level={5} style={{ margin: '16px 0' }}>CÁC HOẠT ĐỘNG GẦN ĐÂY</Title>

            <List
                itemLayout="horizontal"
                dataSource={activityData}
                renderItem={item => (
                    <List.Item style={{ padding: '8px 0' }}>
                        <List.Item.Meta
                            avatar={renderIcon(item.type)}
                            title={
                                <Text>
                                    <Text strong style={{ color: '#1890ff' }}>{item.user}</Text> vừa {item.action}{' '}
                                    {item.value !== '0' &&
                                        <Text>với giá trị {item.value}</Text>
                                    }
                                </Text>
                            }
                            description={<Text type="secondary">{item.time}</Text>}
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default ActivityNotifications;
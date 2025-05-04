import { Card, Row, Col, Typography } from 'antd';
import {
    ShoppingOutlined,
    FileTextOutlined,
    ArrowDownOutlined,
    ArrowUpOutlined
} from '@ant-design/icons';
import { useContext, useEffect, useState } from 'react';
import DashboardService from '../../../services/dashboard';
import { AuthContext } from '../../../utils/auth.context';
import { TodayStatisticDto } from '../../../models/DashboardDto';

const { Title, Text } = Typography;

const SalesResults = () => {
    const { user } = useContext(AuthContext)
    const [todayStatistic, setTodayStatistic] = useState<TodayStatisticDto>({} as TodayStatisticDto);

    useEffect(() => {
        fetchTodayStatistics();
    }, [])

    const fetchTodayStatistics = async () => {
        const dashboardService = new DashboardService();
        try {
            const response = await dashboardService.getTodayStatistic(user?.id);
            setTodayStatistic(response);
        } catch (error) {
            console.error(error);
        }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <Card
            title="KẾT QUẢ BÁN HÀNG HÔM NAY"
            bordered={false}
            style={{
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: '20px'
            }}
        >
            <Row gutter={16} align="middle">
                <Col span={6}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                            style={{
                                backgroundColor: '#1677ff',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: '10px'
                            }}
                        >
                            <ShoppingOutlined style={{ fontSize: '20px', color: 'white' }} />
                        </div>
                        <div>
                            <Text type="secondary">{todayStatistic.invoiceCount} Hóa đơn</Text>
                            <div>
                                <Title level={4} style={{ margin: 0, color: '#1677ff' }}>{formatCurrency(todayStatistic.totalRevenue || 0)}</Title>
                                <Text type="secondary">Doanh thu</Text>
                            </div>
                        </div>
                    </div>
                </Col>

                <Col span={6}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                            style={{
                                backgroundColor: '#ff7a45',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: '10px'
                            }}
                        >
                            <FileTextOutlined style={{ fontSize: '20px', color: 'white' }} />
                        </div>
                        <div>
                            <Text type="secondary">{todayStatistic.returnedOrderCount} phiếu</Text>
                            <div>
                                <Title level={4} style={{ margin: 0, color: '#ff7a45' }}>{todayStatistic.returnedOrderCount}</Title>
                                <Text type="secondary">Trả hàng</Text>
                            </div>
                        </div>
                    </div>
                </Col>

                <Col span={6}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                            style={{
                                backgroundColor: '#ff7a45',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: '10px'
                            }}
                        >
                            <FileTextOutlined style={{ fontSize: '20px', color: 'white' }} />
                        </div>
                        <div>
                            <Text type="secondary">Đã bán</Text>
                            <div>
                                <Title level={4} style={{ margin: 0, color: '#ff7a45' }}>{todayStatistic.totalProductSoldToday}</Title>
                                <Text type="secondary">Tổng số sản phẩm</Text>
                            </div>
                        </div>
                    </div>
                </Col>

                <Col span={6}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                            style={{
                                backgroundColor: '#f5222d',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: '10px'
                            }}
                        >
                            {todayStatistic.changeFromYesterday <= 0 ?
                                <ArrowDownOutlined style={{ fontSize: '20px', color: 'white' }} />
                                :
                                <ArrowUpOutlined style={{ fontSize: '20px', color: 'white' }} />
                            }
                        </div>
                        <div>
                            <Title level={4} style={{ margin: 0, color: '#f5222d' }}>{todayStatistic.changeFromYesterday}%</Title>
                            <Text type="secondary">So với hôm qua</Text>
                        </div>
                    </div>
                </Col>


            </Row>
        </Card>
    );
};

export default SalesResults;
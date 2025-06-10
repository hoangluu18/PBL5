import React, { useState, useEffect, useContext } from 'react';
import {
    Card, Typography, Button, Table, Spin, message, Row, Col,
    Statistic, Tag, Input, Select, Empty, Breadcrumb
} from 'antd';
import {
    WalletOutlined, ReloadOutlined, AreaChartOutlined, SearchOutlined,
    ArrowUpOutlined, ArrowDownOutlined, DollarOutlined, ShopOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../utils/auth.context';
import ShopWalletService, {
    ShopWalletInfo,
    ShopTransactionInfo,
    ShopWalletStatistics
} from '../../../services/shop/ShopWalletService.service';

const { Title, Text } = Typography;
const { Option } = Select;

const ShopWallet: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [walletInfo, setWalletInfo] = useState<ShopWalletInfo | null>(null);
    const [transactions, setTransactions] = useState<ShopTransactionInfo[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<ShopTransactionInfo[]>([]);
    const [statistics, setStatistics] = useState<ShopWalletStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    useEffect(() => {
        if (user?.id) {
            fetchAllData();
        }
    }, [user]);

    useEffect(() => {
        filterTransactions();
    }, [transactions, searchText, filterType]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchWalletInfo(),
                fetchTransactions(),
                fetchStatistics()
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Không thể tải dữ liệu ví. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const fetchWalletInfo = async () => {
        try {
            const data = await ShopWalletService.getShopWalletInfo(user.id);
            setWalletInfo(data);
        } catch (error) {
            console.error('Error fetching wallet info:', error);
            throw error;
        }
    };

    const fetchTransactions = async () => {
        try {
            const data = await ShopWalletService.getShopTransactions(user.id);
            setTransactions(data);
            setFilteredTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }
    };

    const fetchStatistics = async () => {
        try {
            const data = await ShopWalletService.getShopWalletStatistics(user.id);
            setStatistics(data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
            throw error;
        }
    };

    const formatPrice = (price: number) => {
        return Math.floor(price).toLocaleString('vi-VN') + 'đ';
    };

    const filterTransactions = () => {
        let result = [...transactions];

        if (filterType !== 'ALL') {
            result = result.filter(t => t.type === filterType);
        }

        if (searchText) {
            result = result.filter(t =>
                t.description?.toLowerCase().includes(searchText.toLowerCase()) ||
                t.id.toString().includes(searchText) ||
                t.orderId?.toString().includes(searchText)
            );
        }

        setFilteredTransactions(result);
    };

    const refreshData = () => {
        fetchAllData();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'PENDING': return 'processing';
            case 'FAILED': return 'error';
            default: return 'default';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'ESCROW_RELEASE': return '#52c41a';
            case 'REFUND': return '#f5222d';
            case 'COMMISSION': return '#1890ff';
            default: return '#666';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'ESCROW_RELEASE': return <ArrowUpOutlined />;
            case 'REFUND': return <ArrowDownOutlined />;
            case 'COMMISSION': return <DollarOutlined />;
            default: return null;
        }
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'ESCROW_RELEASE': 'Nhận tiền từ đơn hàng',
            'REFUND': 'Hoàn tiền khách hàng',
            'WITHDRAWAL': 'Rút tiền'
        };
        return labels[type] || type;
    };

    const transactionColumns = [
        {
            title: 'Mã giao dịch',
            dataIndex: 'id',
            key: 'id',
            width: 120,
        },
        {
            title: 'Loại giao dịch',
            dataIndex: 'type',
            key: 'type',
            width: 180,
            render: (type: string) => (
                <Tag color={getTypeColor(type)} icon={getTypeIcon(type)}>
                    {getTypeLabel(type)}
                </Tag>
            )
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            width: 150,
            render: (amount: number, record: ShopTransactionInfo) => {
                const color = record.type === 'REFUND' ? '#f5222d' : '#52c41a';
                const prefix = record.type === 'REFUND' ? '-' : '+';
                return (
                    <span style={{ color, fontWeight: 'bold' }}>
                        {prefix} {formatPrice(amount)}
                    </span>
                );
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string) => {
                const labels: Record<string, string> = {
                    'COMPLETED': 'Hoàn thành',
                    'PENDING': 'Đang xử lý',
                    'FAILED': 'Thất bại',
                };
                return <Tag color={getStatusColor(status)}>{labels[status] || status}</Tag>;
            }
        },
        {
            title: 'Đơn hàng',
            dataIndex: 'orderId',
            key: 'orderId',
            width: 120,
            render: (orderId?: number) => orderId ? `#${orderId}` : '-'
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (date: string) => new Date(date).toLocaleString('vi-VN')
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        }
    ];

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
                flexDirection: 'column'
            }}>
                <Spin size="large" />
                <Text style={{ marginTop: 16 }}>Đang tải thông tin ví...</Text>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            {/* Breadcrumb */}
            <Breadcrumb
                style={{ marginBottom: '16px' }}
                items={[
                    { title: <Link to="/shop/dashboard">Dashboard</Link> },
                    { title: 'Ví cửa hàng' },
                ]}
            />

            <Title level={2} style={{ marginBottom: '24px' }}>
                <WalletOutlined /> Ví cửa hàng: {walletInfo?.shopName}
            </Title>

            {/* Thông tin tổng quan */}
            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={8}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={4}>
                                <ShopOutlined /> Số dư hiện tại
                            </Title>
                            <div style={{
                                fontSize: '36px',
                                fontWeight: 'bold',
                                color: '#1890ff',
                                margin: '16px 0'
                            }}>
                                {walletInfo ? formatPrice(walletInfo.balance) : '0đ'}
                            </div>
                            <Button
                                type="primary"
                                icon={<ReloadOutlined />}
                                onClick={refreshData}
                                size="large"
                            >
                                Làm mới
                            </Button>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={16}>
                    <Card>
                        <Title level={4}>
                            <AreaChartOutlined /> Thống kê giao dịch
                        </Title>
                        <Row gutter={24}>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Tổng tiền nhận"
                                    value={formatPrice(statistics?.totalReceived || 0)}
                                    precision={0}
                                    valueStyle={{ color: '#3f8600' }}
                                    prefix={<ArrowUpOutlined />}
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Tổng hoàn tiền"
                                    value={formatPrice(statistics?.totalRefunded || 0)}
                                    precision={0}
                                    valueStyle={{ color: '#cf1322' }}
                                    prefix={<ArrowDownOutlined />}
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Tổng giao dịch"
                                    value={statistics?.totalTransactions || 0}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            {/* Lịch sử giao dịch */}
            <Card>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16
                }}>
                    <Title level={4} style={{ margin: 0 }}>
                        Lịch sử giao dịch
                    </Title>

                    <div style={{ display: 'flex', gap: 16 }}>
                        <Input
                            placeholder="Tìm kiếm giao dịch, đơn hàng..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                            allowClear
                        />

                        <Select
                            defaultValue="ALL"
                            style={{ width: 180 }}
                            onChange={value => setFilterType(value)}
                        >
                            <Option value="ALL">Tất cả</Option>
                            <Option value="ESCROW_RELEASE">Nhận tiền</Option>
                            <Option value="REFUND">Hoàn tiền</Option>
                        </Select>
                    </div>
                </div>

                {filteredTransactions.length > 0 ? (
                    <Table
                        columns={transactionColumns}
                        dataSource={filteredTransactions}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} của ${total} giao dịch`
                        }}
                        scroll={{ x: 'max-content' }}
                    />
                ) : (
                    <Empty
                        description="Chưa có giao dịch nào"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                )}
            </Card>
        </div>
    );
};

export default ShopWallet;
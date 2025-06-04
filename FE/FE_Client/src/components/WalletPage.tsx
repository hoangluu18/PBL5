import React, { useState, useEffect, useContext } from 'react';
import { Card, Typography, Button, Table, Tabs, Spin, Empty, message, Row, Col, Statistic, Divider, Tag, DatePicker, Space, Input, Select } from 'antd';
import { WalletOutlined, ReloadOutlined, PlusOutlined, AreaChartOutlined, SearchOutlined, FilterOutlined, ArrowUpOutlined, ArrowDownOutlined, DollarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../src/components/context/auth.context';
import WalletService, { WalletInfo, TransactionInfo } from '../../src/services/wallet.service';
import './/../css/WalletStyles.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const WalletPage: React.FC = () => {
    const { customer } = useContext(AuthContext);
    const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
    const [transactions, setTransactions] = useState<TransactionInfo[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<TransactionInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const navigate = useNavigate();

    // Tính toán các thống kê
    const totalDeposit = transactions
        .filter(t => t.type === 'DEPOSIT' && t.status === 'COMPLETED')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalPayment = transactions
        .filter(t => t.type === 'PAYMENT' && t.status === 'COMPLETED')
        .reduce((sum, t) => sum + t.amount, 0);

    useEffect(() => {
        if (customer) {
            fetchWalletInfo();
            fetchTransactions();
        }
    }, [customer]);

    // Filter transactions when filter changes
    useEffect(() => {
        filterTransactions();
    }, [transactions, searchText, filterType]);

    const filterTransactions = () => {
        let result = [...transactions];
        
        // Filter by type
        if (filterType !== 'ALL') {
            result = result.filter(t => t.type === filterType);
        }
        
        // Filter by search text
        if (searchText) {
            result = result.filter(t => 
                t.description?.toLowerCase().includes(searchText.toLowerCase()) ||
                t.id.toString().includes(searchText)
            );
        }
        
        setFilteredTransactions(result);
    };

    const fetchWalletInfo = async () => {
        try {
            const data = await WalletService.getWalletInfo(customer.id);
            setWalletInfo(data);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin ví:', error);
            message.error('Không thể lấy thông tin ví. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const fetchTransactions = async () => {
        try {
            const data = await WalletService.getTransactions(customer.id);
            setTransactions(data);
            setFilteredTransactions(data);
        } catch (error) {
            console.error('Lỗi khi lấy lịch sử giao dịch:', error);
        }
    };

    const refreshData = () => {
        setLoading(true);
        fetchWalletInfo();
        fetchTransactions();
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
            case 'DEPOSIT': return '#52c41a';
            case 'PAYMENT': return '#f5222d';
            case 'REFUND': return '#1890ff';
            default: return '#666';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'DEPOSIT': return <ArrowUpOutlined />;
            case 'PAYMENT': return <ArrowDownOutlined />;
            case 'REFUND': return <ArrowUpOutlined />;
            default: return null;
        }
    };

    const transactionColumns = [
        {
            title: 'Mã giao dịch',
            dataIndex: 'id',
            key: 'id',
            width: 100,
        },
        {
            title: 'Loại giao dịch',
            dataIndex: 'type',
            key: 'type',
            width: 150,
            render: (type: string) => {
                const label = {
                    'DEPOSIT': 'Nạp tiền',
                    'PAYMENT': 'Thanh toán',
                    'REFUND': 'Hoàn tiền',
                }[type] || type;
                
                return (
                    <Tag color={getTypeColor(type)} icon={getTypeIcon(type)}>
                        {label}
                    </Tag>
                );
            }
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            width: 150,
            render: (amount: number, record: TransactionInfo) => {
                const color = record.type === 'PAYMENT' ? '#f5222d' : '#52c41a';
                const prefix = record.type === 'PAYMENT' ? '-' : '+';
                return <span style={{ color, fontWeight: 'bold' }}>{prefix} {amount.toLocaleString()} VNĐ</span>;
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string) => {
                const label = {
                    'COMPLETED': 'Hoàn thành',
                    'PENDING': 'Đang xử lý',
                    'FAILED': 'Thất bại',
                }[status] || status;
                
                return <Tag color={getStatusColor(status)}>{label}</Tag>;
            }
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (date: string) => new Date(date).toLocaleString()
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        }
    ];

    if (!customer) {
        navigate('/login');
        return null;
    }

    if (loading) {
        return (
            <div className="wallet-loading">
                <Spin size="large" />
                <Text>Đang tải thông tin ví...</Text>
            </div>
        );
    }

    return (
        <div className="wallet-container">
            {/* Thông tin tổng quan về ví */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={8}>
                    <Card className="wallet-summary-card">
                        <div className="wallet-header">
                            <Title level={2}><WalletOutlined /> Ví của tôi</Title>
                            <Button
                                type="primary"
                                icon={<ReloadOutlined />}
                                onClick={refreshData}
                                className="refresh-button"
                            >
                                Làm mới
                            </Button>
                        </div>

                        <div className="balance-display">
                            <Text>Số dư hiện tại:</Text>
                            <div className="balance-value">
                                <DollarOutlined /> {walletInfo?.balance.toLocaleString()} VNĐ
                            </div>
                        </div>

                        <div className="wallet-actions">
                            <Button
                                type="primary"
                                size="large"
                                icon={<PlusOutlined />}
                                onClick={() => navigate('/wallet/deposit')}
                                className="deposit-button"
                            >
                                Nạp tiền
                            </Button>
                        </div>
                    </Card>
                </Col>
                
                {/* Thống kê */}
                <Col xs={24} lg={16}>
                    <Card className="wallet-stats-card">
                        <Title level={4}><AreaChartOutlined /> Thống kê giao dịch</Title>
                        <Row gutter={24}>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Tổng nạp"
                                    value={totalDeposit}
                                    precision={0}
                                    valueStyle={{ color: '#3f8600' }}
                                    prefix={<ArrowUpOutlined />}
                                    suffix="VNĐ"
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Tổng chi"
                                    value={totalPayment}
                                    precision={0}
                                    valueStyle={{ color: '#cf1322' }}
                                    prefix={<ArrowDownOutlined />}
                                    suffix="VNĐ"
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Số dư hiện tại"
                                    value={walletInfo?.balance || 0}
                                    precision={0}
                                    valueStyle={{ color: '#1890ff' }}
                                    prefix={<DollarOutlined />}
                                    suffix="VNĐ"
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            {/* Lịch sử giao dịch */}
            <Card className="wallet-transactions-card">
                <div className="transactions-header">
                    <Title level={4}>Lịch sử giao dịch</Title>
                    
                    <div className="transaction-filters">
                        <Input
                            placeholder="Tìm kiếm giao dịch"
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                        />
                        
                        <Select 
                            defaultValue="ALL"
                            style={{ width: 150 }}
                            onChange={value => setFilterType(value)}
                        >
                            <Option value="ALL">Tất cả</Option>
                            <Option value="DEPOSIT">Nạp tiền</Option>
                            <Option value="PAYMENT">Thanh toán</Option>
                            <Option value="REFUND">Hoàn tiền</Option>
                        </Select>
                    </div>
                </div>

                {filteredTransactions.length > 0 ? (
                    <Table
                        columns={transactionColumns}
                        dataSource={filteredTransactions}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        className="transactions-table"
                        rowClassName="transaction-row"
                    />
                ) : (
                    <Empty 
                        description="Chưa có giao dịch nào" 
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        className="empty-transactions"
                    />
                )}
            </Card>
        </div>
    );
};

export default WalletPage;
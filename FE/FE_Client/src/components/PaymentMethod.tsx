import React, { useState, useContext, useEffect } from 'react';
import { Card, Radio, Space, Form, Input, Select, Row, Col, Button, Divider, Typography, Badge, Tooltip, Tag, Modal } from 'antd';
import {
    TruckOutlined, ClockCircleOutlined, DollarOutlined, SafetyOutlined,
    CheckCircleOutlined, RocketOutlined, ThunderboltOutlined, GlobalOutlined,
    StarOutlined, WalletOutlined, InfoCircleOutlined, ReloadOutlined
} from '@ant-design/icons';
import { AuthContext } from '../components/context/auth.context';
import WalletService from '../services/wallet.service';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { Text } = Typography;

const PaymentMethod: React.FC<{
    paymentMethod: string,
    setPaymentMethod: (value: string) => void,
    shippingCosts: { shopId: number; shopName: string; shippingCost: number }[],
    totalAmount: number
}> = ({ paymentMethod, setPaymentMethod, shippingCosts, totalAmount }) => {
    const { customer } = useContext(AuthContext);
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [insufficientFunds, setInsufficientFunds] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (customer?.id) {
            fetchWalletInfo();
        }
    }, [customer]);

    // Mỗi khi chọn phương thức thanh toán qua ví, kiểm tra số dư
    useEffect(() => {
        if (paymentMethod === 'wallet') {
            setInsufficientFunds(walletBalance < totalAmount);
        } else {
            setInsufficientFunds(false);
        }
    }, [paymentMethod, walletBalance, totalAmount]);

    const fetchWalletInfo = async () => {
        setLoading(true);
        try {
            const data = await WalletService.getWalletInfo(customer.id);
            setWalletBalance(data.balance);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin ví:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFunds = () => {
        navigate('/wallet/deposit');
    };

    return (
        <Card title="Phương thức thanh toán và vận chuyển" bordered={false} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '30px' }}>
                <Typography.Title level={5} style={{ marginBottom: '16px' }}>
                    <TruckOutlined style={{ marginRight: '8px' }} />
                    Phí vận chuyển theo cửa hàng
                </Typography.Title>

                {shippingCosts.map((cost) => (
                    <div key={cost.shopId} style={{ marginBottom: '10px' }}>
                        <Text strong>{cost.shopName}:</Text>
                        <Text type="danger" style={{ marginLeft: '8px' }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cost.shippingCost)}
                        </Text>
                    </div>
                ))}
            </div>

            <Divider />

            <Typography.Title level={5}>
                <DollarOutlined style={{ marginRight: '8px' }} />
                Chọn phương thức thanh toán
            </Typography.Title>

            <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
                style={{ width: '100%' }}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Radio value="cash">
                        <Space align="center">
                            <DollarOutlined style={{ color: '#52c41a' }} />
                            <span>Tiền mặt khi nhận hàng (COD)</span>
                        </Space>
                    </Radio>

                    <Radio value="wallet">
                        <Space align="center">
                            <WalletOutlined style={{ color: '#1890ff' }} />
                            <span>Thanh toán qua Ví</span>
                            <Tag color={loading ? 'default' : walletBalance >= totalAmount ? 'success' : 'error'}>
                                Số dư: {loading ? 'Đang tải...' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(walletBalance)}
                            </Tag>

                            {!loading && walletBalance < totalAmount && (
                                <Button
                                    type="primary"
                                    size="small"
                                    danger
                                    icon={<ReloadOutlined />}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleAddFunds();
                                    }}
                                >
                                    Nạp tiền
                                </Button>
                            )}
                        </Space>
                    </Radio>
                </Space>
            </Radio.Group>

            {paymentMethod === 'wallet' && (
                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: loading ? '#f5f5f5' : insufficientFunds ? '#fff2f0' : '#f6ffed', borderRadius: '4px' }}>
                    {loading ? (
                        <Text type="secondary">
                            <InfoCircleOutlined style={{ marginRight: '8px' }} />
                            Đang kiểm tra số dư ví...
                        </Text>
                    ) : insufficientFunds ? (
                        <Text type="danger">
                            <InfoCircleOutlined style={{ marginRight: '8px' }} />
                            Số dư trong ví không đủ. Bạn cần thêm {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount - walletBalance)} để thanh toán.
                        </Text>
                    ) : (
                        <Text type="success">
                            <SafetyOutlined style={{ marginRight: '8px' }} />
                            Số dư đủ để thanh toán. Khi bạn xác nhận đặt hàng, tiền sẽ được giữ lại và chỉ chuyển cho người bán sau khi giao hàng thành công.
                        </Text>
                    )}
                </div>
            )}
        </Card>
    );
};

export default PaymentMethod;
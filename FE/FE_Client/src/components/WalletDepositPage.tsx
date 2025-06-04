import React, { useState, useContext, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, message, Result, Row, Col, Statistic, Divider, Radio, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { WalletOutlined, SafetyOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { AuthContext } from '../../src/components/context/auth.context';
import WalletService from '../../src/services/wallet.service';
import './/../css/WalletStyles.css';

const { Title, Text, Paragraph } = Typography;

const WalletDepositPage: React.FC = () => {
    const [form] = Form.useForm();
    const { customer } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [newBalance, setNewBalance] = useState<number | null>(null);
    const [currentBalance, setCurrentBalance] = useState<number>(0);
    const navigate = useNavigate();

    // Thêm effect để lấy số dư hiện tại
    useEffect(() => {
        if (customer) {
            const fetchWalletInfo = async () => {
                try {
                    const data = await WalletService.getWalletInfo(customer.id);
                    setCurrentBalance(data.balance);
                } catch (error) {
                    console.error('Lỗi khi lấy thông tin ví:', error);
                }
            };
            fetchWalletInfo();
        }
    }, [customer]);

    // Các mệnh giá phổ biến
    const commonAmounts = [100000, 200000, 500000, 1000000, 2000000];

    if (!customer) {
        return (
            <Result
                status="403"
                title="Bạn chưa đăng nhập"
                subTitle="Vui lòng đăng nhập để sử dụng tính năng này"
                extra={
                    <Button type="primary" onClick={() => navigate('/login')}>
                        Đăng nhập
                    </Button>
                }
            />
        );
    }

    const handleDeposit = async (values: any) => {
        setLoading(true);
        try {
            const amount = parseFloat(values.amount);

            if (isNaN(amount) || amount <= 0) {
                message.error('Vui lòng nhập số tiền hợp lệ');
                setLoading(false);
                return;
            }

            const response = await WalletService.depositToWallet(customer.id, amount);
            setNewBalance(response.newBalance);
            setSuccess(true);
            message.success('Nạp tiền thành công!');
        } catch (error) {
            console.error('Lỗi khi nạp tiền:', error);
            message.error('Có lỗi xảy ra khi nạp tiền. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    // Chọn mệnh giá phổ biến
    const handleCommonAmountSelect = (value: number) => {
        form.setFieldsValue({ amount: value });
    };

    if (success) {
        return (
            <div className="wallet-container">
                <Card className="deposit-success-card">
                    <Result
                        icon={<CheckCircleOutlined className="success-icon" />}
                        status="success"
                        title="Nạp tiền thành công!"
                        subTitle={
                            <div className="success-balance">
                                <Paragraph>Số dư hiện tại của bạn là:</Paragraph>
                                <div className="balance-amount">{newBalance?.toLocaleString()} VNĐ</div>
                            </div>
                        }
                        extra={[
                            <Button type="primary" key="wallet" size="large" onClick={() => navigate('/wallet')}>
                                Xem ví của tôi
                            </Button>,
                            <Button key="again" size="large" onClick={() => {
                                setSuccess(false);
                                form.resetFields();
                            }}>
                                Nạp thêm tiền
                            </Button>
                        ]}
                    />
                </Card>
            </div>
        );
    }

    return (
        <div className="wallet-container">
            <Row gutter={24}>
                <Col xs={24} md={16}>
                    <Card className="deposit-card" title={<Title level={2}><WalletOutlined /> Nạp tiền vào ví</Title>}>
                        <Row gutter={[0, 24]}>
                            <Col span={24}>
                                <Statistic 
                                    title="Số dư hiện tại" 
                                    value={currentBalance} 
                                    precision={0} 
                                    suffix="VNĐ"
                                    valueStyle={{ color: '#3f8600' }}
                                    prefix={<DollarOutlined />}
                                />
                            </Col>
                        </Row>

                        <Divider />

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleDeposit}
                            className="deposit-form"
                        >
                            <Form.Item
                                name="amount"
                                label="Số tiền muốn nạp (VNĐ)"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số tiền' },
                                    {
                                        validator: (_, value) => {
                                            const num = parseFloat(value);
                                            if (isNaN(num) || num <= 0) {
                                                return Promise.reject('Số tiền phải lớn hơn 0');
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <Input
                                    type="number"
                                    prefix={<DollarOutlined className="site-form-item-icon" />}
                                    placeholder="Nhập số tiền cần nạp"
                                    suffix="VNĐ"
                                    size="large"
                                />
                            </Form.Item>

                            <div className="common-amounts">
                                <Text>Chọn mệnh giá phổ biến:</Text>
                                <div className="amount-buttons">
                                    {commonAmounts.map(amount => (
                                        <Button 
                                            key={amount} 
                                            onClick={() => handleCommonAmountSelect(amount)}
                                            className="amount-button"
                                        >
                                            {amount.toLocaleString()} VNĐ
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    block
                                    size="large"
                                    className="deposit-button"
                                >
                                    Nạp tiền ngay
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card className="info-card">
                        <Title level={4}><SafetyOutlined /> Lưu ý khi nạp tiền</Title>
                        <ul className="notice-list">
                            <li>Số tiền tối thiểu cho mỗi lần nạp là 10,000 VNĐ</li>
                            <li>Số dư sẽ được cập nhật ngay sau khi nạp thành công</li>
                            <li>Bạn có thể sử dụng số dư để thanh toán đơn hàng</li>
                            <li>Nếu gặp vấn đề, vui lòng liên hệ với chúng tôi qua hotline: 1900-xxxx</li>
                        </ul>

                        <Divider />

                        <Title level={4}>Câu hỏi thường gặp</Title>
                        <div className="faq-list">
                            <Paragraph strong>1. Tôi có thể nạp tối đa bao nhiêu tiền?</Paragraph>
                            <Paragraph>Không có giới hạn nạp tiền. Bạn có thể nạp số tiền tùy ý.</Paragraph>

                            <Paragraph strong>2. Tôi có thể rút tiền từ ví không?</Paragraph>
                            <Paragraph>Hiện tại, chúng tôi chưa hỗ trợ rút tiền từ ví. Số dư chỉ có thể dùng để thanh toán đơn hàng.</Paragraph>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default WalletDepositPage;
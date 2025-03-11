import React from 'react';
import { Card, Radio, Space, Form, Input, Select, Row, Col, Button } from 'antd';


import visaImg from '../assets/Visa.jpg';
import mastercardImg from '../assets/master_card.png';


const { Option } = Select;

const PaymentMethod: React.FC<{ paymentMethod: string, setPaymentMethod: (value: string) => void }> = ({ paymentMethod, setPaymentMethod }) => {
    // Tạm thời gán thông tin cứng
    const cardOptions = [
        { value: 'visa', label: 'Visa', imgSrc: visaImg },
        { value: 'mastercard', label: 'Mastercard', imgSrc: mastercardImg }
    ];

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);

    return (
        <Card title="Phương thức thanh toán" bordered={false} style={{ marginBottom: '20px' }}>
            <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
                style={{ width: '100%' }}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Radio value="credit">
                        <span style={{ marginLeft: '8px' }}>Thẻ tín dụng</span>
                        <div style={{ marginLeft: '32px', marginTop: '5px' }}>
                            <Space>
                                {cardOptions.map(option => (
                                    <img key={option.value} src={option.imgSrc} alt={option.label} width={32} />
                                ))}
                            </Space>
                        </div>
                    </Radio>

                    <Radio value="momo">
                        <span style={{ marginLeft: '8px' }}>Ví MoMo</span>
                    </Radio>

                    <Radio value="cash">
                        <span style={{ marginLeft: '8px' }}>Tiền mặt khi nhận hàng</span>
                    </Radio>
                </Space>
            </Radio.Group>

            {paymentMethod === 'credit' && (
                <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #f0f0f0', borderRadius: '5px' }}>
                    <Form layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Chọn thẻ">
                                    <Select placeholder="Chọn thẻ">
                                        {cardOptions.map(option => (
                                            <Option key={option.value} value={option.value}>{option.label}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Số thẻ">
                                    <Input placeholder="Nhập số thẻ" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Tên đầy đủ">
                            <Input placeholder="Tên trên thẻ" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Hết hạn">
                                    <Input.Group compact>
                                        <Select style={{ width: '50%' }} placeholder="Tháng">
                                            {months.map(month => (
                                                <Option key={month} value={month}>Tháng {month}</Option>
                                            ))}
                                        </Select>
                                        <Select style={{ width: '50%' }} placeholder="Năm">
                                            {years.map(year => (
                                                <Option key={year} value={year}>{year}</Option>
                                            ))}
                                        </Select>
                                    </Input.Group>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="CVC">
                                    <Input placeholder="Nhập mã CVC" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item>
                            <Button type="primary" style={{ marginRight: '10px' }}>Lưu thông tin thẻ</Button>
                        </Form.Item>
                    </Form>
                </div>
            )}

            <div style={{ marginTop: '20px' }}>
                <Form.Item label="Mã giảm giá">
                    <Input.Group compact>
                        <Input style={{ width: 'calc(100% - 100px)' }} placeholder="Nhập mã giảm giá" />
                        <Button type="primary" style={{ width: '100px' }}>Áp dụng</Button>
                    </Input.Group>
                </Form.Item>
            </div>
        </Card>
    );
};

export default PaymentMethod;
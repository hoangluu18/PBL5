import React, { useState } from 'react';
import { Card, Radio, Space, Form, Input, Select, Row, Col, Button, Divider, Typography, Badge, Tooltip } from 'antd';

import {
    TruckOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    SafetyOutlined,
    CheckCircleOutlined,
    RocketOutlined,
    ThunderboltOutlined,
    GlobalOutlined,
    StarOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Text } = Typography;

const PaymentMethod: React.FC<{
    paymentMethod: string,
    setPaymentMethod: (value: string) => void,
    shippingCosts: { shopId: number; shopName: string; shippingCost: number }[]
}> = ({ paymentMethod, setPaymentMethod, shippingCosts }) => {
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
                    <Radio value="credit">
                        <span style={{ marginLeft: '8px' }}>Thẻ tín dụng / Ghi nợ</span>
                    </Radio>
                    <Radio value="momo">
                        <span style={{ marginLeft: '8px' }}>Ví MoMo</span>
                    </Radio>
                    <Radio value="bank_transfer">
                        <span style={{ marginLeft: '8px' }}>Chuyển khoản ngân hàng</span>
                    </Radio>
                    <Radio value="cash">
                        <span style={{ marginLeft: '8px' }}>Tiền mặt khi nhận hàng (COD)</span>
                    </Radio>
                </Space>
            </Radio.Group>
        </Card>
    );
};
export default PaymentMethod;
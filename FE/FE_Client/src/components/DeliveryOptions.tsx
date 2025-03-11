import React from 'react';
import { Card, Radio, Row, Col, Tag } from 'antd';

const DeliveryOptions: React.FC<{ deliveryType: string, setDeliveryType: (value: string) => void }> = ({ deliveryType, setDeliveryType }) => {

    const deliveryOptions = [
        {
            value: 'free',
            title: 'Giao hàng miễn phí 0đ',
            estimate: 'Ước tính: giao hàng 21 Th6 - 20 Th7',
            description: 'Nhận sản phẩm miễn phí đúng hẹn!',
            popular: true
        },
        {
            value: 'twoday',
            title: 'Giao hàng 2 ngày 20.000đ',
            estimate: 'Ước tính: giao hàng 21 Th6 - 20 Th7',
            description: 'Mọi thứ nhanh hơn với phí giao hàng tối thiểu',
            popular: false
        },
        {
            value: 'standard',
            title: 'Giao hàng tiêu chuẩn 10.000đ',
            estimate: 'Ước tính: giao hàng 21 Th6 - 20 Th7',
            description: 'Giao hàng đúng hẹn với giá tiết kiệm',
            popular: false
        },
        {
            value: 'oneday',
            title: 'Giao hàng 1 ngày 30.000đ',
            estimate: 'Ước tính: giao hàng 21 Th6 - 30 Th7',
            description: 'Ưu tiên cao nhất với giá thấp nhất',
            popular: false
        }
    ];

    return (
        <Card title="Hình thức giao hàng" bordered={false} style={{ marginBottom: '20px' }}>
            <div className="delivery-options">
                <Radio.Group onChange={(e) => setDeliveryType(e.target.value)} value={deliveryType} style={{ width: '100%' }}>
                    <Row gutter={[16, 16]}>
                        {deliveryOptions.map(option => (
                            <Col span={12} key={option.value}>
                                <Radio value={option.value} style={{ width: '100%' }}>
                                    <Card
                                        size="small"
                                        style={{ width: '100%' }}
                                        className={deliveryType === option.value ? 'selected-delivery' : ''}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>{option.title}</div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>{option.estimate}</div>
                                                <div style={{ fontSize: '12px', color: '#1890ff' }}>{option.description}</div>
                                            </div>
                                            {option.popular && <Tag color="orange" style={{ marginLeft: '5px' }}>PHỔ BIẾN</Tag>}
                                        </div>
                                    </Card>
                                </Radio>
                            </Col>
                        ))}
                    </Row>
                </Radio.Group>
            </div>
        </Card>
    );
};

export default DeliveryOptions;
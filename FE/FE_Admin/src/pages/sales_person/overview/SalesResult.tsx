import { Card, Row, Col, Typography } from 'antd';
import {
    ShoppingOutlined,
    FileTextOutlined,
    ArrowDownOutlined,
    ArrowUpOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const SalesResults = () => {
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
                            <Text type="secondary">1 Hóa đơn</Text>
                            <div>
                                <Title level={4} style={{ margin: 0, color: '#1677ff' }}>103,000</Title>
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
                            <Text type="secondary">0 phiếu</Text>
                            <div>
                                <Title level={4} style={{ margin: 0, color: '#ff7a45' }}>0</Title>
                                <Text type="secondary">Trả hàng</Text>
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
                            <ArrowDownOutlined style={{ fontSize: '20px', color: 'white' }} />
                        </div>
                        <div>
                            <Title level={4} style={{ margin: 0, color: '#f5222d' }}>-84.51%</Title>
                            <Text type="secondary">So với hôm qua</Text>
                        </div>
                    </div>
                </Col>

                <Col span={6}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                            style={{
                                backgroundColor: '#52c41a',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: '10px'
                            }}
                        >
                            <ArrowUpOutlined style={{ fontSize: '20px', color: 'white' }} />
                        </div>
                        <div>
                            <Title level={4} style={{ margin: 0, color: '#52c41a' }}>117.26%</Title>
                            <Text type="secondary">So với cùng kỳ tuần trước</Text>
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default SalesResults;
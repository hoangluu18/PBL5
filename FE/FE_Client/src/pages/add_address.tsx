import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Card, Typography, Select } from 'antd';
import { RightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const AddAddress: React.FC = () => {
    const [form] = Form.useForm();

    // Tạm thời gán thông tin cứng
    const [fullName, setFullName] = useState('Nguyễn Văn A');
    const [email, setEmail] = useState('nguyenvana@example.com');
    const [phone, setPhone] = useState('+84123456789');
    const [address, setAddress] = useState('1234 Elm Street, Van Nuys, CA');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [street, setStreet] = useState('');

    const handleCityChange = (value: string) => {
        setCity(value);
        // Gọi API để lấy danh sách quận/huyện dựa trên tỉnh/thành phố đã chọn
    };

    const handleDistrictChange = (value: string) => {
        setDistrict(value);
        // Gọi API để lấy danh sách phường/xã dựa trên quận/huyện đã chọn
    };

    const handleWardChange = (value: string) => {
        setWard(value);
    };

    return (
        <div style={{
            background: 'linear-gradient(0deg, #F5F7FA, #F5F7FA), #FFFFFF',
            padding: '40px',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div className='container'>
                <Title level={2}>Thêm địa chỉ nhận hàng</Title>

                <Card title="Thông tin địa chỉ" bordered={false} style={{ marginBottom: '20px' }}>
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{ fullName, email, phone, address, city, district, ward, street }}
                    >
                        <Form.Item label="Họ và tên" name="fullName">
                            <Input placeholder="Họ và tên" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Email" name="email">
                                    <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Số điện thoại" name="phone">
                                    <Input placeholder="+1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Địa chỉ" name="address">
                            <Input placeholder="1234 Elm Street, Van Nuys, CA" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Tỉnh/Thành phố" name="city">
                                    <Select placeholder="Chọn Tỉnh/Thành phố" onChange={handleCityChange}>
                                        {/* Thêm các tùy chọn tỉnh/thành phố */}
                                        <Option value="hanoi">Hà Nội</Option>
                                        <Option value="hcm">TP. Hồ Chí Minh</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Quận/Huyện" name="district">
                                    <Select placeholder="Chọn Quận/Huyện" onChange={handleDistrictChange}>
                                        {/* Thêm các tùy chọn quận/huyện */}
                                        <Option value="district1">Quận 1</Option>
                                        <Option value="district2">Quận 2</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Phường/Xã" name="ward">
                            <Select placeholder="Chọn Phường/Xã" onChange={handleWardChange}>
                                {/* Thêm các tùy chọn phường/xã */}
                                <Option value="ward1">Phường 1</Option>
                                <Option value="ward2">Phường 2</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Tên đường, Tòa nhà, Số nhà" name="street">
                            <Input placeholder="Tên đường, Tòa nhà, Số nhà" value={street} onChange={(e) => setStreet(e.target.value)} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary"
                                style={{
                                    width: '150px',
                                    height: '40px',
                                    background: '#4F80E1',
                                    borderColor: '#4F80E1'
                                }}>
                                Lưu địa chỉ
                            </Button>
                            <Button
                                type="link"
                                style={{ marginLeft: '10px' }}>
                                Thoát, không lưu
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default AddAddress;
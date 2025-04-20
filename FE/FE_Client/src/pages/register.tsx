import { Form, Input, Button, Checkbox, Typography, notification, Row, Col, Divider } from 'antd';
import { FacebookOutlined, GoogleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthService from '../services/auth.service';
import CustomerService from '../services/customer.service';

const { Title, Text } = Typography;

type FieldType = {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
};

const RegisterPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();

    document.title = "Đăng ký";

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const customerService = new CustomerService();
            const isUnique = await customerService.checkUniqueEmail(values.email);

            if (!isUnique) {
                api.error({
                    message: 'Email đã tồn tại',
                    description: 'Vui lòng sử dụng email khác để đăng ký.',
                    placement: 'topRight',
                });
                return;
            }

            const payload: FieldType = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
                phoneNumber: values.phoneNumber,
            };

            const authService = new AuthService();
            await authService.register(payload);

            api.success({
                message: 'Đăng ký thành công!',
                description: 'Tài khoản của bạn đã được tạo thành công. Vui lòng kích hoạt trong email để có thể đăng nhập.',
                placement: 'topRight',
                duration: 2,
                onClose: () => navigate('/login'),
            });

            form.resetFields();
        } catch (errorInfo) {
            console.error('Failed:', errorInfo);
            api.error({
                message: 'Đăng ký thất bại',
                description: 'Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.',
                placement: 'topRight',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        const redirectUri = `${window.location.origin}/oauth2/redirect`;
        window.location.href = `http://localhost:8081/api/auth/oauth2/redirect?redirect_uri=${encodeURIComponent(redirectUri)}`;
    };

    return (
        <Row style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
            {contextHolder}
            
            {/* Phần form đăng ký bên trái - đã điều chỉnh kích thước */}
            <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ 
                padding: '30px 40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff'
            }}>
                <div style={{ 
                    width: '100%',
                    maxWidth: '480px',
                    padding: '30px',
                    border: '1px solid #e8e8e8',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}>
                    {/* Logo và tiêu đề phía trên - đã giảm kích thước */}
                    <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                        <img 
                            src="https://pbl5.s3.ap-southeast-1.amazonaws.com/systems/logo.png" 
                            alt="Logo" 
                            style={{ height: '35px', marginBottom: '15px' }}
                        />
                        <Title level={4}>Sell online with PBL5</Title>
                    </div>

                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <Title level={3} style={{ margin: '0 0 5px' }}>Đăng ký</Title>
                        <Text type="secondary">Tạo tài khoản của bạn</Text>
                    </div>

                    <Form form={form} layout="vertical" size="middle">
                        <div style={{ marginBottom: '12px' }}>
                            <Button
                                icon={<GoogleOutlined />}
                                style={{ width: '100%', height: '40px', borderRadius: '6px' }}
                                onClick={handleGoogleLogin}
                            >
                                Đăng ký với Google
                            </Button>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <Button
                                icon={<FacebookOutlined />}
                                style={{ width: '100%', height: '40px', borderRadius: '6px' }}
                            >
                                Đăng ký với Facebook
                            </Button>
                        </div>
                        
                        <Divider plain style={{ margin: '15px 0' }}>
                            <Text type="secondary" style={{ fontSize: '14px' }}>hoặc sử dụng email</Text>
                        </Divider>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Form.Item<FieldType>
                                name="firstName"
                                label="Họ"
                                style={{ width: '48%' }}
                                rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                            >
                                <Input placeholder="Họ" style={{ height: '38px', borderRadius: '6px' }} />
                            </Form.Item>

                            <Form.Item<FieldType>
                                name="lastName"
                                label="Tên"
                                style={{ width: '48%' }}
                                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                            >
                                <Input placeholder="Tên" style={{ height: '38px', borderRadius: '6px' }} />
                            </Form.Item>
                        </div>

                        <Form.Item<FieldType>
                            name="email"
                            label="Địa chỉ Email"
                            rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
                        >
                            <Input placeholder="name@example.com" style={{ height: '38px', borderRadius: '6px' }} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="phoneNumber"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                        >
                            <Input placeholder="Số điện thoại" style={{ height: '38px', borderRadius: '6px' }} />
                        </Form.Item>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Form.Item<FieldType>
                                name="password"
                                label="Mật khẩu"
                                style={{ width: '48%' }}
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                            >
                                <Input.Password placeholder="Mật khẩu" style={{ height: '38px', borderRadius: '6px' }} />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                label="Xác nhận mật khẩu"
                                style={{ width: '48%' }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng xác nhận mật khẩu!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu không khớp!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder="Xác nhận mật khẩu" style={{ height: '38px', borderRadius: '6px' }} />
                            </Form.Item>
                        </div>

                        <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: '15px' }}>
                            <Checkbox>
                                Tôi đồng ý với <span style={{ color: '#1890ff' }}>điều khoản</span> và{' '}
                                <span style={{ color: '#1890ff' }}>chính sách bảo mật</span>
                            </Checkbox>
                        </Form.Item>

                        <Form.Item style={{ marginBottom: '15px' }}>
                            <Button
                                type="primary"
                                style={{ width: '100%', height: '40px', borderRadius: '6px', fontSize: '15px' }}
                                onClick={handleSubmit}
                                loading={loading}
                            >
                                Đăng ký
                            </Button>
                        </Form.Item>

                        <div style={{ textAlign: 'center', marginTop: '12px' }}>
                            <Text type="secondary">Đã có tài khoản? </Text>
                            <Link to="/login" style={{ color: '#1890ff' }}>Đăng nhập ngay!</Link>
                        </div>
                    </Form>
                </div>
            </Col>
            
            {/* Phần hình ảnh bên phải - đã tăng kích thước tương đối */}
            <Col xs={0} sm={0} md={12} lg={12} xl={12} style={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '50px 50px 50px 70px',
                backgroundColor: '#fff',
                position: 'relative'
            }}>
                {/* Hình ảnh chính */}
                <div style={{ textAlign: 'center', paddingRight: '30px' }}>
                    <img 
                        src="https://pbl5.s3.ap-southeast-1.amazonaws.com/systems/login.png" 
                        alt="Register Illustration" 
                        style={{ 
                            width: '100%',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }} 
                    />
                </div>

                {/* Phần giới thiệu phía dưới */}
                <div style={{ maxWidth: '450px', paddingLeft: '30px', marginTop: '30px' }}>
                    <Text style={{ color: '#555', fontSize: '16px', lineHeight: '1.6', display: 'block' }}>
                        PBL5_Ecommerce là một giải pháp thương mại điện tử đầy đủ tính năng và giá cả phải chăng
                        bao gồm các cửa hàng web, thiết bị di động và mạng xã hội.
                    </Text>
                </div>
            </Col>
        </Row>
    );
};

export default RegisterPage;
import { Form, Input, Button, Checkbox, Typography, notification, Row, Col } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../utils/auth.context';
import AuthService from '../../services/auth.service';

const { Title, Text } = Typography;
type FieldType = {
    email?: string;
    password?: string;
    remember?: string;
};

const LoginPage = () => {
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const { setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    document.title = "Đăng nhập";

    const handleLogin = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const authService = new AuthService();
            const response = await authService.login(values.email, values.password);

            api.success({
                message: 'Đăng nhập thành công',
                placement: 'topRight',
                duration: 1,
                onClose: () => {
                    const { accessToken, id, name, photo, roles } = response;

                    const user = { id, name, photo, roles };
                    localStorage.setItem("user", JSON.stringify(user));
                    localStorage.setItem("access_token", (accessToken));
                    setUser(user);
                    navigate("/");
                },
            });
        }
        catch (error: any) {
            const { data } = error.response || {};
            const errorMessage = data?.errors || data?.message || 'Tài khoản hoặc mật khẩu không chính xác.';

            api.error({
                message: 'Đăng nhập thất bại',
                description: error.response?.data || errorMessage,
                placement: 'topRight',
                duration: 2,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Row style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
            {contextHolder}

            {/* Phần form đăng nhập bên trái */}
            <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{
                padding: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '450px',
                    padding: '40px',
                    border: '1px solid #e8e8e8',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}>
                    {/* Logo và tiêu đề phía trên */}
                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <img
                            src="https://pbl5.s3.ap-southeast-1.amazonaws.com/systems/logo.png"
                            alt="Logo"
                            style={{ height: '40px', marginBottom: '20px' }}
                        />
                        <Title level={3}>Welcome to PBL5 Ecommerce</Title>
                    </div>

                    <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                        <Title level={2} style={{ margin: '0 0 8px' }}>Đăng nhập</Title>
                        <Text type="secondary">Truy cập vào tài khoản của bạn</Text>
                    </div>

                    <Form form={form} layout="vertical" size="large">
                        <Form.Item<FieldType>
                            name="email"
                            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                        >
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="Email"
                                style={{ height: '44px', borderRadius: '6px' }}
                            />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="Mật khẩu"
                                style={{ height: '44px', borderRadius: '6px' }}
                            />
                        </Form.Item>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <Form.Item<FieldType> name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                            </Form.Item>
                            <Link to="/forgot-password" style={{ color: '#1890ff' }}>Quên mật khẩu?</Link>
                        </div>

                        <Form.Item>
                            <Button
                                type="primary"
                                block
                                style={{ height: '44px', borderRadius: '6px' }}
                                onClick={handleLogin}
                                loading={loading}
                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Col>

            {/* Phần hình ảnh bên phải */}
            <Col xs={0} sm={0} md={12} lg={12} xl={12} style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '50px',
                backgroundColor: '#fff',
                position: 'relative'
            }}>
                {/* Hình ảnh chính, kích thước lớn hơn */}
                <img
                    src="https://pbl5.s3.ap-southeast-1.amazonaws.com/systems/login.png"
                    alt="Login Illustration"
                    style={{
                        width: '100%',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}
                />

                {/* Phần giới thiệu phía dưới */}
                <div style={{ maxWidth: '600px', margin: '30px auto 0' }}>
                    <Text style={{ color: '#555', fontSize: '16px', lineHeight: '1.6', display: 'block' }}>
                        PBL5_Ecommerce là một giải pháp thương mại điện tử đầy đủ tính năng và giá cả phải chăng
                        bao gồm các cửa hàng web, thiết bị di động và mạng xã hội.
                    </Text>
                </div>
            </Col>
        </Row>
    );
};

export default LoginPage;
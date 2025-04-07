import { Form, Input, Button, Checkbox, Divider, Typography, message, notification } from 'antd';
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
    const [api, contextHolder] = notification.useNotification(); // 👈 Sửa tại đây

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
            message.error('Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: '500px',
                margin: '30px auto',
                border: '1px solid #ececec',
                borderRadius: '10px',
                textAlign: 'center',
                padding: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
        >
            {contextHolder} {/* 👈 Bắt buộc phải có */}
            <div>
                <div>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>
                        <span>🔥</span>
                    </div>
                </div>

                <div>
                    <Title level={3} style={{ margin: '0' }}>
                        Sign Up
                    </Title>
                    <Text style={{ color: '#666' }}>Create your account</Text>
                </div>

                <Form form={form} layout="vertical" style={{ marginTop: '20px' }}>
                    <div className="mt-2">
                        <Button
                            icon={<GoogleOutlined className="text-danger" />}
                            className="w-100 hover-underline"
                            style={{ height: '40px' }}
                        >
                            Sign up with Google
                        </Button>
                    </div>
                    <div className="mt-2">
                        <Button
                            icon={<FacebookOutlined className="text-primary" />}
                            className="w-100 hover-underline"
                            style={{ height: '40px' }}
                        >
                            Sign up with Facebook
                        </Button>
                    </div>
                    <div>
                        <Divider style={{ fontWeight: '300' }}>
                            <Text>or use email</Text>
                        </Divider>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <Form.Item<FieldType>
                            name="firstName"
                            label="First Name"
                            style={{ width: '48%' }}
                            rules={[{ required: true, message: 'Please input your first name!' }]}
                        >
                            <Input placeholder="First Name" />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="lastName"
                            label="Last Name"
                            style={{ width: '48%' }}
                            rules={[{ required: true, message: 'Please input your last name!' }]}
                        >
                            <Input placeholder="Last Name" />
                        </Form.Item>
                    </div>

                    <Form.Item<FieldType>
                        name="email"
                        label="Email Address"
                        rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}
                    >
                        <Input placeholder="name@example.com" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="phoneNumber"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                    >
                        <Input placeholder="Phone Number" />
                    </Form.Item>

                    <div className="d-flex justify-content-between align-items-center">
                        <Form.Item<FieldType>
                            name="password"
                            label="Password"
                            style={{ width: '48%' }}
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password placeholder="Password" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Confirm Password"
                            style={{ width: '48%' }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirm Password" />
                        </Form.Item>
                    </div>

                    <Form.Item name="remember" valuePropName="checked" style={{ display: 'flex' }}>
                        <Checkbox>
                            I accept the <span className="text-primary">terms</span> and{' '}
                            <span className="text-primary">privacy policy</span>
                        </Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            className="w-100"
                            onClick={handleSubmit}
                            loading={loading}
                            style={{ height: '40px', fontSize: '16px' }}
                        >
                            Register
                        </Button>
                    </Form.Item>

                    <div className="text-center" style={{ marginTop: '10px' }}>
                        <Link to={'/login'} className="text-primary">
                            Sign in to existing account!
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default RegisterPage;

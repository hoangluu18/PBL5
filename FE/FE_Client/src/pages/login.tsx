import { Form, Input, Button, Checkbox, Divider, Typography, notification } from 'antd';
import { FacebookOutlined, GoogleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { AuthContext } from '../components/context/auth.context';
import { useContext } from 'react';

const { Title, Text } = Typography;
type FieldType = {
    email?: string;
    password?: string;
    remember?: string;
};

const LoginPage = () => {
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const { setCustomer } = useContext(AuthContext);
    document.title = "Đăng nhập";

    const handleLogin = async () => {
        try {
            const values = await form.validateFields();  // Validate form fields

            const authService = new AuthService();
            const response = await authService.login(values.email, values.password);


            api.success({
                message: 'Đăng nhập thành công',
                placement: 'topRight',
                duration: 1,
                onClose: () => {
                    const { accessToken, id, email, username, avatar, phoneNumber } = response;

                    localStorage.setItem("access_token", accessToken);

                    const customer = { id, email, username, avatar, phoneNumber };
                    localStorage.setItem("customer", JSON.stringify(customer));

                    setCustomer(customer);
                    window.location.href = '/';
                },
            });
        }
        catch (error: any) {
            const { data } = error.response;
            const errorMessage = data?.errors || data?.message || 'Tài khoản hoặc mật khẩu không chính xác.';
            if (error.response) {
                console.log('Server error:', error.response);

                api.error({
                    message: 'Đăng nhập thất bại',
                    description: error.response.data,
                    placement: 'topRight',
                    duration: 2,
                });
            } else {
                // Nếu có lỗi khác, không phải từ server
                api.error({
                    message: 'Đăng nhập thất bại',
                    description: errorMessage,
                    placement: 'topRight',
                    duration: 2,
                });
            }
        }
    }

    return (
        <div style={{
            maxWidth: "500px", margin: "80px auto", border: "1px solid #ececec", borderRadius: "10px",
            textAlign: "center", padding: "10px"
        }}>
            {contextHolder}
            <div>
                <div>
                    <div>
                        <span>🔥</span>
                    </div>
                </div>

                <div>
                    <Title level={3}>Sign In</Title>
                    <Text>Get access to your account</Text>
                </div>

                <Form form={form} layout="vertical">
                    <div className='mt-2'>
                        <Button
                            icon={<GoogleOutlined className='text-danger' />}
                            className='w-100 hover-underline'
                        >
                            Sign in with Google
                        </Button>
                    </div>
                    <div className='mt-2'>
                        <Button
                            icon={<FacebookOutlined className='text-primary' />}
                            className='w-100 hover-underline'
                        >
                            Sign in with Facebook
                        </Button>
                    </div>
                    <div>
                        <Divider style={{ fontWeight: "300" }}><Text>or use email</Text></Divider>
                    </div>

                    <Form.Item<FieldType>
                        name="email"
                        label={<span className='text-primary'>Email Address</span>}
                        rules={[{ required: true, message: 'Please input your email!' }]}>
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="name@example.com"
                        />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="password"
                        label={<span className='text-primary'>Password</span>}
                        rules={[{ required: true, message: 'Please input your password!' }]}>
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                        />
                    </Form.Item>

                    <div className='d-flex justify-content-between align-items-center'>
                        <Form.Item<FieldType> name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <Link to={"/forgot_password"} className='text-primary hover-underline'>Forgot Password?</Link>
                    </div>

                    <Form.Item>
                        <Button type="primary" style={{ width: "100%", marginTop: "20px" }} onClick={handleLogin}>
                            Sign In
                        </Button>
                    </Form.Item>

                    <div className="text-center">
                        <Link to={"/register"} className='text-primary'>Create an account</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;

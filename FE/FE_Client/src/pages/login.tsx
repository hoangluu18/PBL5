import { Form, Input, Button, Checkbox, Divider, Typography } from 'antd';
import { FacebookOutlined, GoogleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';


const { Title, Text } = Typography;
type FieldType = {
    email?: string;
    password?: string;
    remember?: string;
};



const LoginPage = () => {
    const [form] = Form.useForm();

    return (
        <div style={{
            maxWidth: "500px", margin: "80px auto", border: "1px solid #ececec", borderRadius: "10px",
            textAlign: "center", padding: "10px"
        }}>
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
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="name@example.com"
                        />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="password"
                        label={<span className='text-primary '>Password</span>}
                        rules={[{ required: true, type: "email", message: 'Please input your password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"

                        />
                    </Form.Item>

                    <div
                        className='d-flex justify-content-between align-items-center'>
                        <Form.Item<FieldType> name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <Link to={"/forgot_password"} className='text-primary hover-underline'
                        >Forgot Password?</Link>
                    </div>

                    <Form.Item>
                        <Button type="primary" style={{ width: "100%", marginTop: "20px" }}>
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
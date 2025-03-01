import { Form, Input, Button, Checkbox, Divider, Typography } from 'antd';
import { FacebookOutlined, GoogleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';


const { Title, Text } = Typography;

type FieldType = {
    username?: string,
    email?: string;
    password?: string;
};

const RegisterPage = () => {
    const [form] = Form.useForm();

    return (
        <div style={{
            maxWidth: "500px", margin: "30px auto", border: "1px solid #ececec", borderRadius: "10px",
            textAlign: "center", padding: "10px "
        }}>
            <div>
                <div>
                    <div>
                        <span>🔥</span>
                    </div>
                </div>

                <div>
                    <Title level={3}>Sign Up</Title>
                    <Text>Create your account</Text>
                </div>

                <Form form={form} layout="vertical">
                    <div className='mt-2'>
                        <Button
                            icon={<GoogleOutlined className='text-danger' />}
                            className='w-100 hover-underline'
                        >
                            Sign up with Google
                        </Button>
                    </div>
                    <div className='mt-2'>
                        <Button
                            icon={<FacebookOutlined className='text-primary' />}
                            className='w-100 hover-underline'
                        >
                            Sign up with Facebook
                        </Button>
                    </div>
                    <div>
                        <Divider style={{ fontWeight: "300" }}><Text>or use email</Text></Divider>
                    </div>

                    <Form.Item<FieldType>
                        name="username"
                        label="Username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input
                            placeholder="name@example.com"
                        />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="email"
                        label="Email Address"
                        rules={[{ required: true, type: "email", message: 'Please input your email!' }]}
                    >
                        <Input
                            placeholder="name@example.com"
                        />
                    </Form.Item>

                    <div className='d-flex justify-content-between align-items-center'>
                        <Form.Item<FieldType>
                            name="password"
                            label="Password"
                            style={{ width: "45%" }}
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password
                                placeholder="Password"

                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Confirm Password"
                            style={{ width: "45%" }}
                            rules={[{ required: true, message: 'Please input your confirm password!' }]}
                        >
                            <Input.Password
                                placeholder="Password"

                            />
                        </Form.Item>
                    </div>

                    <Form.Item name="remember" valuePropName="checked" style={{ display: 'flex' }}>
                        <Checkbox >I accept the <span className='text-primary'>terms</span> and <span className='text-primary'>privacy policy</span></Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" className='w-100'>
                            Register
                        </Button>
                    </Form.Item>

                    <div className="text-center">
                        <Link to={"/login"} className='text-primary'>Sign in to existing account!</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default RegisterPage;
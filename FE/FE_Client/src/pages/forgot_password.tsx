import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import { Link } from "react-router-dom";



const { Title, Text } = Typography;

type FieldType = {
    email: string
}

const ForgotPasswordPage = () => {
    return (
        <>
            <div style={{
                maxWidth: "500px", margin: "150px auto", border: "1px solid #ececec", borderRadius: "10px",
                textAlign: "center", padding: "10px "
            }}>
                <div> <span>🔥</span></div>

                <div>
                    <Title level={4}>Forgot your password?</Title>
                    <Text>Enter your email bellow and we will send you a reset link</Text>
                </div>

                <Form layout="horizontal" className="mt-3 d-flex justify-content-between">
                    <Form.Item<FieldType> style={{ width: "80%" }}
                        name="email"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input className="w-100" placeholder="Email" />
                    </Form.Item>
                    <Form.Item>
                        <Button>Send <ArrowRightOutlined /></Button>
                    </Form.Item>
                </Form>

                <div className="mt-1">
                    <Link to={"/"}><Text className="text-primary">Still having problems?</Text></Link>
                </div>
            </div >
        </>
    )
}

export default ForgotPasswordPage;
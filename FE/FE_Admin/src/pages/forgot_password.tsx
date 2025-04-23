import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification, Typography } from "antd";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const { Title, Text } = Typography;

type FieldType = {
    email: string
}

const ForgotPasswordPage = () => {
    const [api, contextHolder] = notification.useNotification();
    document.title = "Quên mật khẩu";

    const handleForgotPassword = (values: FieldType) => {
        const authService = new AuthService();
        authService.forgotPassword(values.email)
            .then((response) => {
                api.success({
                    message: 'Gửi thành công',
                    description: response,
                    placement: 'topRight',
                    duration: 2,
                });
            })
            .catch((error) => {
                api.error({
                    message: 'Gửi thất bại',
                    description: error,
                    placement: 'topRight',
                    duration: 2,
                });
            });
    }

    return (
        <>
            <div style={{
                maxWidth: "500px", margin: "150px auto", border: "1px solid #ececec", borderRadius: "10px",
                textAlign: "center", padding: "10px "
            }}>
                <div> <span>🔥</span></div>
                {contextHolder}
                <div>
                    <Title level={4}>Quên mật khẩu?</Title>
                    <Text>Nhập email của bạn để gửi link đặt lại mật khẩu?</Text>
                </div>

                <Form layout="horizontal" className="mt-3 d-flex justify-content-between" onFinish={handleForgotPassword}>
                    <Form.Item<FieldType> style={{ width: "80%" }}
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                    >
                        <Input className="w-100" placeholder="Email" />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit">Gửi <ArrowRightOutlined /></Button>
                    </Form.Item>
                </Form>

                <div className="mt-1">
                    <Link to={"/login"}><Text className="text-primary">Đăng nhập</Text></Link>
                </div>
            </div >
        </>
    )
}

export default ForgotPasswordPage;
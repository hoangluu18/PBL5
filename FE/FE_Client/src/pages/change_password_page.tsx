import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification, Typography } from "antd";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthService from "../services/auth.service";

const { Title, Text } = Typography;

type FieldType = {
    newPassword: string;
    confirmPassword: string;
}

const ChangePasswordPage = () => {
    const [api, contextHolder] = notification.useNotification();
    document.title = "Đổi mật khẩu";

    const location = useLocation();
    const token = new URLSearchParams(location.search).get("token");
    const errorToken = () => {
        api.error({
            message: "Lỗi xác thực",
            description: "Token không hợp lệ",
            placement: "topRight",
            duration: 2,
            onClose: () => {
                window.location.href = '/login';
            }
        });
    }
    useEffect(() => {
        const authService = new AuthService();
        if (token) {
            authService.checkToken(token)
                .then((response) => {
                    console.log("Token is valid:", response);
                })
                .catch((error) => {
                    errorToken();
                });
        } else {
            errorToken();
        }
    }, [token]);

    const handleChangePassword = async (values: FieldType) => {
        const authService = new AuthService();
        try {
            if (token) {
                const response = await authService.resetPassword(token, values.newPassword);
                console.log("Password changed successfully:", response);
                api.success({
                    message: "Đổi mật khẩu thành công",
                    description: response,
                    placement: "topRight",
                    duration: 2,
                    onClose: () => {
                        window.location.href = '/login';
                    }
                });
            } else {
                errorToken();
            }
            console.log("Password changed successfully:", values);
            // Redirect to login or show success message
        } catch (error) {
            console.error("Error changing password:", error);
            // Handle error (e.g., show error message)
        }
    }

    return (
        <>
            <div style={{
                maxWidth: "500px", margin: "150px auto", border: "1px solid #ececec", borderRadius: "10px",
                textAlign: "center", padding: "10px "
            }}>
                <div> <span>🔑</span></div>
                {contextHolder}
                <div>
                    <Title level={4}>Change your password</Title>
                    <Text>Enter your current password and create a new one</Text>
                </div>

                <Form
                    layout="vertical"
                    className="mt-3"
                    style={{ padding: "0 30px" }}
                    onFinish={handleChangePassword}
                >
                    <Form.Item<FieldType>
                        name="newPassword"
                        rules={[
                            { required: true, message: 'Please input your new password!' },
                            { min: 8, message: 'Password must be at least 8 characters' }
                        ]}
                    >
                        <Input.Password placeholder="New Password" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Please confirm your new password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm New Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                            Change Password <ArrowRightOutlined />
                        </Button>
                    </Form.Item>
                </Form>

                <div className="mt-3 mb-3">
                    <Link to={"/login"}><Text className="text-primary">Đăng nhập</Text></Link>
                </div>
            </div>
        </>
    );
};

export default ChangePasswordPage;
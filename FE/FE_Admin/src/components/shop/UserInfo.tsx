import React, { useState, useEffect, useContext } from 'react';
import {
    Form,
    Input,
    Button,
    Card,
    Typography,
    message,
    Row,
    Col,
    Avatar,
    Divider,
    Upload,
    Spin
} from 'antd';
import {
    UserOutlined,
    LockOutlined,
    EditOutlined,
    SaveOutlined,
    UploadOutlined
} from '@ant-design/icons';
import { AuthContext } from '../../../src/utils/auth.context';
import ProfileService from '../../../src/services/profile.service';

const { Title, Text } = Typography;

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    photos: string;
    enabled: boolean;
}

interface PasswordChangeValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const UserInfo: React.FC = () => {
    const { user, setUser } = useContext(AuthContext);
    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [uploadLoading, setUploadLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const profile = await ProfileService.getUserProfile(user.id);
            setUserInfo(profile);
            setImageUrl(profile.photos || '');

            profileForm.setFieldsValue({
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email
            });
        } catch (error) {
            console.error('Lỗi khi tải thông tin người dùng:', error);
            message.error('Không thể tải thông tin người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileSubmit = async () => {
        try {
            const values = await profileForm.validateFields();

            setLoading(true);
            const updatedProfile = await ProfileService.updateUserProfile(user.id, {
                firstName: values.firstName,
                lastName: values.lastName
            });

            setUserInfo(updatedProfile);

            // Cập nhật thông tin user trong context
            const updatedUser = {
                ...user,
                name: `${values.firstName} ${values.lastName}`
            };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            message.success('Cập nhật thông tin thành công');
            setEditMode(false);
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error);
            message.error('Không thể cập nhật thông tin người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async () => {
        try {
            const values = await passwordForm.validateFields() as PasswordChangeValues;

            setLoading(true);
            await ProfileService.changePassword(user.id, {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword
            });

            message.success('Đổi mật khẩu thành công');
            passwordForm.resetFields();
            setPasswordVisible(false);
        } catch (error: any) {
            console.error('Lỗi khi đổi mật khẩu:', error);
            message.error(error.response?.data || 'Không thể đổi mật khẩu');
        } finally {
            setLoading(false);
        }
    };

const handleUploadPhoto = (info: any) => {
    if (info.file.status === 'uploading') {
        setUploadLoading(true);
        return;
    }
    
    if (info.file.status === 'done') {
        setUploadLoading(false);
        // Thông báo và cập nhật UI được xử lý trong customRequest
    } else if (info.file.status === 'error') {
        setUploadLoading(false);
        message.error('Tải ảnh lên thất bại');
    }
};


    // Thêm hàm customRequest
    const customUploadRequest = async (options: any) => {
        const { file, onSuccess, onError } = options;

        if (!user || !user.id) {
            onError(new Error('Không tìm thấy thông tin người dùng'));
            return;
        }

        setUploadLoading(true);

        try {
            const updatedUser = await ProfileService.uploadPhoto(user.id, file);
            setImageUrl(updatedUser.photos);
            setUserInfo(prev => prev ? { ...prev, photos: updatedUser.photos } : null);

            // Cập nhật user context nếu cần
            if (setUser && user) {
                setUser({
                    ...user,
                    photos: updatedUser.photos
                });
            }

            message.success('Cập nhật ảnh đại diện thành công');
            onSuccess(updatedUser);
        } catch (error) {
            console.error('Lỗi khi tải ảnh lên:', error);
            message.error('Không thể tải ảnh lên');
            onError(error);
        } finally {
            setUploadLoading(false);
        }
    };

    // Thay đổi Upload component
    <Upload
        name="avatar"
        listType="text"
        showUploadList={false}
        customRequest={customUploadRequest}
    // Xóa beforeUpload
    >
        <Button
            icon={<UploadOutlined />}
            loading={uploadLoading}
            style={{ marginTop: 16 }}
        >
            Thay đổi ảnh đại diện
        </Button>
    </Upload>

    if (loading && !userInfo) {
        return <Spin size="large" />;
    }

    return (
        <Card title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4}>Thông tin người đại diện</Title>
                {!editMode ? (
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => setEditMode(true)}
                    >
                        Chỉnh sửa
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleProfileSubmit}
                    >
                        Lưu
                    </Button>
                )}
            </div>
        } bordered={false}>
            <Row gutter={24}>
                <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                    <Avatar
                        size={120}
                        src={imageUrl || undefined}
                        icon={!imageUrl ? <UserOutlined /> : undefined}
                    />
                    {editMode && (
                        <Upload
                            name="avatar"
                            listType="text"
                            showUploadList={false}
                            customRequest={customUploadRequest}
                        // Xóa beforeUpload
                        >
                            <Button
                                icon={<UploadOutlined />}
                                loading={uploadLoading}
                                style={{ marginTop: 16 }}
                            >
                                Thay đổi ảnh đại diện
                            </Button>
                        </Upload>
                    )}
                </Col>

                <Col xs={24} md={16}>
                    <Form
                        form={profileForm}
                        layout="vertical"
                        disabled={!editMode}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="firstName"
                                    label="Họ"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
                                >
                                    <Input prefix={<UserOutlined />} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="lastName"
                                    label="Tên"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                                >
                                    <Input prefix={<UserOutlined />} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="email"
                            label="Email"
                        >
                            <Input prefix={<UserOutlined />} disabled />
                        </Form.Item>

                        {editMode && (
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                >
                                    {passwordVisible ? 'Hủy đổi mật khẩu' : 'Đổi mật khẩu'}
                                </Button>
                            </Form.Item>
                        )}
                    </Form>

                    {passwordVisible && editMode && (
                        <div>
                            <Divider orientation="left">Đổi mật khẩu</Divider>
                            <Form
                                form={passwordForm}
                                layout="vertical"
                                onFinish={handlePasswordSubmit}
                            >
                                <Form.Item
                                    name="currentPassword"
                                    label="Mật khẩu hiện tại"
                                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                                >
                                    <Input.Password prefix={<LockOutlined />} />
                                </Form.Item>

                                <Form.Item
                                    name="newPassword"
                                    label="Mật khẩu mới"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                                    ]}
                                >
                                    <Input.Password prefix={<LockOutlined />} />
                                </Form.Item>

                                <Form.Item
                                    name="confirmPassword"
                                    label="Xác nhận mật khẩu mới"
                                    dependencies={['newPassword']}
                                    rules={[
                                        { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('newPassword') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('Hai mật khẩu không khớp nhau');
                                            },
                                        })
                                    ]}
                                >
                                    <Input.Password prefix={<LockOutlined />} />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                    >
                                        Cập nhật mật khẩu
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    )}
                </Col>
            </Row>
        </Card>
    );
};

export default UserInfo;
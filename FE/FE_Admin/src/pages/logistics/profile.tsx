import React, { useState, useEffect, useContext } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Upload,
    message,
    Avatar,
    Typography,
    Row,
    Col,
    Descriptions
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    EditOutlined,
    SaveOutlined,
    CameraOutlined
} from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload/interface';
import { AuthContext } from '../../utils/auth.context';
import LogisticService from '../../services/logistic/logistic.service';

const { Title, Text } = Typography;

interface UserProfile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    photo: string;
}

const ProfilePage: React.FC = () => {
    const { user, setUser } = useContext(AuthContext);

    const [profile, setProfile] = useState<UserProfile>({
        id: user?.id || 0,
        email: '',
        firstName: '',
        lastName: '',
        photo: user?.photo || ''
    });

    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    // Thêm state để lưu file ảnh tạm thời
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewPhoto, setPreviewPhoto] = useState<string>('');

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const logisticService = new LogisticService();
            const userProfile = await logisticService.getProfile(user?.id || 0);
            setProfile(userProfile);
            setPreviewPhoto(userProfile.photo || '');
            setUser({
                ...user,
                name: `${userProfile.firstName} ${userProfile.lastName}`,
                photo: userProfile.photo || ''
            });
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            message.error('Failed to load profile data');
        }
        setLoading(false);
    };

    const handleEditToggle = () => {
        if (editMode) {
            // Reset về trạng thái ban đầu khi hủy
            form.resetFields();
            setSelectedFile(null);
            setPreviewPhoto(profile.photo);
            setEditMode(false);
        } else {
            // Entering edit mode
            form.setFieldsValue({
                email: profile.email,
                firstName: profile.firstName,
                lastName: profile.lastName
            });
            setEditMode(true);
        }
    };

    // Hàm xử lý cập nhật profile gom chung cả ảnh và thông tin
    const handleProfileUpdate = async (values: any) => {
        setLoading(true);
        try {
            const logisticService = new LogisticService();
            let photoUrl = profile.photo; // Giữ ảnh cũ nếu không có ảnh mới

            // Nếu có file ảnh mới được chọn, upload trước

            const updatedProfile = {
                ...profile,
                ...values,
                photo: selectedFile?.name
            };

            await logisticService.updateProfile(updatedProfile);

            setProfile(updatedProfile);
            setPreviewPhoto(photoUrl);
            setSelectedFile(null); // Reset file đã chọn

            console.log('Profile updated:', updatedProfile);

            // Update AuthContext user
            setUser({
                ...user,
                name: `${values.firstName} ${values.lastName}`,
                photo: photoUrl
            });

            message.success('Cập nhật thông tin thành công');
            setEditMode(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            message.error('Không thể cập nhật thông tin');
        } finally {
            setLoading(false);
        }
    };

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Chỉ cho phép tải lên file JPG/PNG!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
            return false;
        }

        // Lưu file vào state thay vì upload ngay lập tức
        setSelectedFile(file);

        // Tạo preview URL cho ảnh
        const previewUrl = URL.createObjectURL(file);
        setPreviewPhoto(previewUrl);

        message.success('Đã chọn ảnh mới. Nhấn "Lưu" để cập nhật.');

        return false; // Ngăn không cho upload tự động
    };

    // Hàm xử lý khi người dùng xóa ảnh đã chọn
    const handleRemovePhoto = () => {
        setSelectedFile(null);
        setPreviewPhoto(profile.photo); // Trở về ảnh gốc
        message.info('Đã hủy chọn ảnh mới');
    };

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={8} lg={6}>
                    <Card loading={loading}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <Avatar
                                    src={previewPhoto || profile.photo}
                                    size={120}
                                    icon={<UserOutlined />}
                                    style={{ marginBottom: 16 }}
                                />
                                {editMode && (
                                    <>
                                        <Upload
                                            showUploadList={false}
                                            beforeUpload={beforeUpload}
                                            accept="image/png, image/jpeg, image/jpg"
                                        >
                                            <Button
                                                type="primary"
                                                shape="circle"
                                                icon={<CameraOutlined />}
                                                size="small"
                                                style={{
                                                    position: 'absolute',
                                                    right: 0,
                                                    bottom: 16,
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                                                }}
                                            />
                                        </Upload>
                                        {selectedFile && (
                                            <Button
                                                type="default"
                                                size="small"
                                                onClick={handleRemovePhoto}
                                                style={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    bottom: 16,
                                                    fontSize: '10px'
                                                }}
                                            >
                                                Hủy
                                            </Button>
                                        )}
                                    </>
                                )}
                            </div>
                            <Title level={4}>{profile.firstName} {profile.lastName}</Title>
                            <Text type="secondary">{profile.email}</Text>
                            {selectedFile && (
                                <div style={{ marginTop: 8 }}>
                                    <Text type="success" style={{ fontSize: '12px' }}>
                                        Ảnh mới: {selectedFile.name}
                                    </Text>
                                </div>
                            )}
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={24} md={16} lg={18}>
                    <Card loading={loading}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Title level={3}>Thông tin cá nhân</Title>
                            <Button
                                type={editMode ? "default" : "primary"}
                                icon={editMode ? <SaveOutlined /> : <EditOutlined />}
                                onClick={handleEditToggle}
                            >
                                {editMode ? "Hủy" : "Chỉnh sửa"}
                            </Button>
                        </div>

                        {editMode ? (
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleProfileUpdate}
                            >
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="firstName"
                                            label="Tên"
                                            rules={[{ required: true, message: 'Vui lòng nhập tên của bạn' }]}
                                        >
                                            <Input prefix={<UserOutlined />} placeholder="Tên" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="lastName"
                                            label="Họ"
                                            rules={[{ required: true, message: 'Vui lòng nhập họ của bạn' }]}
                                        >
                                            <Input prefix={<UserOutlined />} placeholder="Họ" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email' },
                                        { type: 'email', message: 'Vui lòng nhập email hợp lệ' }
                                    ]}
                                >
                                    <Input prefix={<MailOutlined />} placeholder="Email" />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        block
                                    >
                                        {selectedFile ? 'Lưu thay đổi (bao gồm ảnh mới)' : 'Lưu thay đổi'}
                                    </Button>
                                </Form.Item>
                            </Form>
                        ) : (
                            <Descriptions bordered column={1}>
                                <Descriptions.Item label="Tên">{profile.firstName}</Descriptions.Item>
                                <Descriptions.Item label="Họ">{profile.lastName}</Descriptions.Item>
                                <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
                            </Descriptions>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProfilePage;
import React, { useState, useEffect } from 'react';
import {
    Tabs, Card, Upload, Button, Form, Input, Space,
    message, Row, Col, Typography, Divider, Modal, Spin,
    Popconfirm, List, Avatar,
    Tag
} from 'antd';
import {
    UploadOutlined, PlusOutlined, DeleteOutlined,
    EditOutlined, PictureOutlined, SaveOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { TabsProps } from 'antd';
import AdminService from '../../services/admin/admin.service';

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface Logo {
    id: string;
    url: string;
    name: string;
    active: boolean;
}

interface CarouselImage {
    id: string;
    url: string;
    title: string;
    description: string;
    order: number;
    active: boolean;
}

const SettingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('1');
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);

    // Logo state
    const [currentLogo, setCurrentLogo] = useState<Logo | null>(null);
    const [logoFile, setLogoFile] = useState<UploadFile | null>(null);

    // Carousel state
    const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
    const [editingImage, setEditingImage] = useState<CarouselImage | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [carouselFileList, setCarouselFileList] = useState<UploadFile[]>([]);
    const [carouselForm] = Form.useForm();

    document.title = 'Cài Đặt Hệ Thống | Admin';

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const adminService = new AdminService();


        } catch (error) {
            console.error('Failed to fetch settings:', error);
            message.error('Không thể tải thông tin cài đặt.');
        } finally {
            setLoading(false);
        }
    };

    // Logo tab methods
    const handleLogoUpload: UploadProps['onChange'] = ({ fileList }) => {
        if (fileList.length > 0) {
            setLogoFile(fileList[fileList.length - 1]);
        } else {
            setLogoFile(null);
        }
    };



    // Carousel tab methods
    const showAddImageModal = () => {
        setEditingImage(null);
        carouselForm.resetFields();
        setCarouselFileList([]);
        setIsModalVisible(true);
    };

    const showEditImageModal = (image: CarouselImage) => {
        setEditingImage(image);
        carouselForm.setFieldsValue({
            title: image.title,
            description: image.description,
            order: image.order,
            active: image.active
        });
        setCarouselFileList([]);
        setIsModalVisible(true);
    };

    const handleCarouselUpload: UploadProps['onChange'] = ({ fileList }) => {
        setCarouselFileList(fileList);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingImage(null);
        carouselForm.resetFields();
        setCarouselFileList([]);
    };

    // Tab items
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Logo Website',
            children: (
                <Card className="shadow-sm">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Row gutter={[24, 24]}>
                            <Col xs={24} md={12}>
                                <Title level={4}>Logo Hiện Tại</Title>
                                <div className="p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 mb-4 flex items-center justify-center min-h-[200px]">
                                    {currentLogo ? (
                                        <img
                                            src={currentLogo.url}
                                            alt="Current Logo"
                                            className="max-w-full max-h-[200px] object-contain"
                                        />
                                    ) : (
                                        <Text type="secondary">Chưa có logo</Text>
                                    )}
                                </div>
                            </Col>
                            <Col xs={24} md={12}>
                                <Title level={4}>Cập Nhật Logo Mới</Title>
                                <Dragger
                                    name="logo"
                                    listType="picture"
                                    maxCount={1}
                                    accept=".png,.jpg,.jpeg,.svg"
                                    onChange={handleLogoUpload}
                                    fileList={logoFile ? [logoFile] : []}
                                    beforeUpload={() => false}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <UploadOutlined />
                                    </p>
                                    <p className="ant-upload-text">Nhấp hoặc kéo file vào đây để tải lên</p>
                                    <p className="ant-upload-hint">
                                        Hỗ trợ PNG, JPG, JPEG, SVG. Kích thước tối đa 2MB.
                                    </p>
                                </Dragger>

                                <div className="mt-4">
                                    <Button
                                        type="primary"
                                        icon={<SaveOutlined />}
                                        loading={saving}
                                        disabled={!logoFile}
                                    >
                                        Lưu Logo
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    )}
                </Card>
            ),
        },
        {
            key: '2',
            label: 'Ảnh Carousel',
            children: (
                <Card className="shadow-sm">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <Title level={4}>Quản lý Ảnh Carousel</Title>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={showAddImageModal}
                                >
                                    Thêm Ảnh
                                </Button>
                            </div>

                            <List
                                itemLayout="vertical"
                                dataSource={carouselImages}
                                renderItem={(item) => (
                                    <List.Item
                                        key={item.id}
                                        actions={[
                                            <Button
                                                icon={<EditOutlined />}
                                                type="link"
                                                onClick={() => showEditImageModal(item)}
                                            >
                                                Sửa
                                            </Button>,
                                            <Popconfirm
                                                title="Bạn có chắc muốn xóa hình ảnh này?"
                                                okText="Xóa"
                                                cancelText="Hủy"
                                            >
                                                <Button
                                                    danger
                                                    type="link"
                                                    icon={<DeleteOutlined />}
                                                >
                                                    Xóa
                                                </Button>
                                            </Popconfirm>,
                                            <Button
                                                type={item.active ? "default" : "primary"}
                                            >
                                                {item.active ? 'Tắt' : 'Kích hoạt'}
                                            </Button>
                                        ]}
                                        extra={
                                            <img
                                                width={272}
                                                alt={item.title}
                                                src={item.url}
                                                style={{ maxHeight: '150px', objectFit: 'cover' }}
                                            />
                                        }
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    icon={<PictureOutlined />}
                                                    src={item.url}
                                                />
                                            }
                                            title={<span className="text-lg">{item.title}</span>}
                                            description={
                                                <Space direction="vertical">
                                                    <Text type="secondary">{item.description}</Text>
                                                    <div>
                                                        <Text type="secondary">Thứ tự: {item.order}</Text>
                                                        <Tag color={item.active ? 'green' : 'red'} className="ml-2">
                                                            {item.active ? 'Đang hiển thị' : 'Đang ẩn'}
                                                        </Tag>
                                                    </div>
                                                </Space>
                                            }
                                        />
                                    </List.Item>
                                )}
                                locale={{
                                    emptyText: (
                                        <div className="py-8 text-center">
                                            <PictureOutlined style={{ fontSize: 48 }} className="text-gray-300" />
                                            <p className="mt-2 text-gray-500">Chưa có ảnh carousel nào</p>
                                            <Button
                                                type="primary"
                                                icon={<PlusOutlined />}
                                                onClick={showAddImageModal}
                                                className="mt-2"
                                            >
                                                Thêm Ảnh
                                            </Button>
                                        </div>
                                    )
                                }}
                            />
                        </>
                    )}
                </Card>
            ),
        },
    ];

    return (
        <div className="setting-page">
            <Card
                title={<Title level={3}>Cài Đặt Hệ Thống</Title>}
                className="shadow-md mb-4"
            >
                <Tabs
                    defaultActiveKey="1"
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={items}
                />
            </Card>

            {/* Carousel Image Modal */}
            <Modal
                title={editingImage ? "Chỉnh sửa ảnh carousel" : "Thêm ảnh carousel mới"}
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
                width={700}
            >
                <Form
                    form={carouselForm}
                    layout="vertical"
                >
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input placeholder="Nhập tiêu đề cho ảnh" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                    >
                        <Input.TextArea rows={3} placeholder="Nhập mô tả cho ảnh" />
                    </Form.Item>

                    <Form.Item
                        name="order"
                        label="Thứ tự hiển thị"
                        rules={[{ required: true, message: 'Vui lòng nhập thứ tự!' }]}
                        initialValue={1}
                    >
                        <Input type="number" min={1} placeholder="Thứ tự hiển thị" />
                    </Form.Item>

                    <Form.Item
                        label="Hình ảnh"
                        required={!editingImage}
                    >
                        <Upload
                            listType="picture-card"
                            fileList={carouselFileList}
                            onChange={handleCarouselUpload}
                            beforeUpload={() => false}
                            maxCount={1}
                            accept=".png,.jpg,.jpeg"
                        >
                            {carouselFileList.length >= 1 ? null : (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Tải lên</div>
                                </div>
                            )}
                        </Upload>
                        {editingImage && !carouselFileList.length && (
                            <div className="mt-2">
                                <Text type="secondary">
                                    Để trống nếu không muốn thay đổi ảnh hiện tại.
                                </Text>
                                <div className="mt-2">
                                    <img
                                        src={editingImage.url}
                                        alt="Current carousel"
                                        style={{ maxWidth: '200px', maxHeight: '150px' }}
                                    />
                                </div>
                            </div>
                        )}
                    </Form.Item>

                    <Divider />

                    <Form.Item className="mb-0 flex justify-end">
                        <Space>
                            <Button onClick={handleModalCancel}>Hủy</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={saving}
                                icon={<SaveOutlined />}
                            >
                                {editingImage ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SettingPage;
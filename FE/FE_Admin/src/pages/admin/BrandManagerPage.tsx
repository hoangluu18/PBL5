import React, { useState, useEffect } from 'react';
import {
    Table, Button, Input, Modal, Form, Upload,
    Space, Card, message, Typography, Popconfirm, Image
} from 'antd';
import {
    PlusOutlined, SearchOutlined, EditOutlined,
    DeleteOutlined, UploadOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { TablePaginationConfig } from 'antd/es/table';
import BrandService from '../../services/admin/brand.service';
import { Brand } from '../../models/Brand';

const { Title } = Typography;


const BrandManagerPage: React.FC = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [searchText, setSearchText] = useState<string>('');
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Create instance of BrandService
    const brandService = new BrandService();

    // Fetch brands from API
    const fetchBrands = async () => {
        try {
            setLoading(true);
            const brandList = await brandService.getBrands();
            setBrands(brandList);

            // Filter brands if search text exists
            const filtered = searchText ?
                brandList.filter(brand =>
                    brand.name.toLowerCase().includes(searchText.toLowerCase())
                ) : brandList;

            setFilteredBrands(filtered);

            setPagination({
                ...pagination,
                total: filtered.length
            });
        } catch (error) {
            console.error('Error fetching brands:', error);
            message.error('Failed to fetch brands');
        } finally {
            setLoading(false);
        }
    };

    // Handle search filter
    useEffect(() => {
        // Add a null check here to prevent the TypeError
        if (brands?.length > 0) {  // Use optional chaining
            const filtered = searchText ?
                brands.filter(brand =>
                    brand.name.toLowerCase().includes(searchText.toLowerCase())
                ) : brands;

            setFilteredBrands(filtered);

            setPagination({
                ...pagination,
                current: 1, // Reset to first page on search
                total: filtered.length
            });
        } else {
            // Handle empty brands array
            setFilteredBrands([]);
            setPagination({
                ...pagination,
                current: 1,
                total: 0
            });
        }
    }, [searchText, brands]);

    useEffect(() => {
        fetchBrands();
    }, []);

    const showCreateModal = () => {
        setEditingBrand(null);
        form.resetFields();
        setFileList([]); // Clear file list
        setModalVisible(true);
    };

    const showEditModal = (brand: Brand) => {
        setEditingBrand(brand);
        form.setFieldsValue({
            name: brand.name,
        });

        // Set file list directly 
        setFileList(brand.logo ? [{
            uid: '-1',
            name: 'Current Logo',
            status: 'done',
            url: brand.logo,
        }] : []);

        setModalVisible(true);
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        form.resetFields();
    };

    const handleDelete = async (id: number) => {
        try {
            setLoading(true);
            await brandService.deleteBrand(id);
            message.success('Brand deleted successfully');
            fetchBrands(); // Refresh brands list
        } catch (error) {
            console.error('Error deleting brand:', error);
            message.error('Failed to delete brand');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields(); // validate Form
            const name = values.name;

            // Get the actual File object, not just the name
            const logoFile = fileList[0].originFileObj?.name;

            setLoading(true);
            if (editingBrand) {
                // Update existing brand
                await brandService.updateBrand(editingBrand.id, name, logoFile || '');
            } else {
                // Send actual file object, not just name
                await brandService.createBrand(name, logoFile || '');
            }

            message.success("Brand created successfully!");
            form.resetFields();
            setFileList([]);
            setModalVisible(false);
            // Refresh brand list
            fetchBrands();
        } catch (error) {
            console.error("Submit error:", error);
            message.error("Failed to create brand");
        } finally {
            setLoading(false);
        }
    };



    const handlePageChange = (page: number, pageSize?: number) => {
        setPagination({
            ...pagination,
            current: page,
            pageSize: pageSize || 10
        });
    };

    const handleSearch = () => {
        // Just trigger the useEffect by setting the searchText state
        // Already handled in the useEffect
    };



    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: Brand, b: Brand) => a.name.localeCompare(b.name)
        },
        {
            title: 'Logo',
            dataIndex: 'logo',
            key: 'logo',
            render: (logo: string) => (
                <Image
                    src={logo}
                    alt="Brand logo"
                    width={100}
                    height={60}
                    style={{ objectFit: 'contain' }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u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"
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_: any, record: Brand) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                        size="small"
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this brand?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="brand-manager">
            <Card title={<Title level={3}>Brand Management</Title>} className="mb-4">
                <Space style={{ marginBottom: 16 }} className="flex justify-between">
                    <Input
                        placeholder="Search brands"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onPressEnter={handleSearch}
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showCreateModal}
                    >
                        Add Brand
                    </Button>
                </Space>

                <Table
                    columns={columns}
                    dataSource={filteredBrands}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        onChange: handlePageChange,
                        showSizeChanger: true,
                    }}
                />
            </Card>

            <Modal
                title={editingBrand ? "Edit Brand" : "Add New Brand"}
                open={modalVisible}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="back" onClick={handleModalCancel}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={loading}
                        onClick={handleSubmit}
                    >
                        {editingBrand ? "Update" : "Create"}
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="brandForm"
                >
                    <Form.Item
                        name="name"
                        label="Brand Name"
                        rules={[{ required: true, message: 'Please enter brand name!' }]}
                    >
                        <Input placeholder="Enter brand name" />
                    </Form.Item>

                    <Form.Item
                        label="Brand Logo"
                        rules={[{
                            required: !editingBrand && fileList.length === 0,
                            message: 'Please upload brand logo!'
                        }]}
                    >
                        <Upload
                            fileList={fileList}
                            beforeUpload={(file) => {
                                const isImage = file.type.startsWith('image/');
                                if (!isImage) {
                                    message.error('You can only upload image files!');
                                    return Upload.LIST_IGNORE;
                                }

                                const isLessThan2MB = file.size / 1024 / 1024 < 2;
                                if (!isLessThan2MB) {
                                    message.error('Image must be smaller than 2MB!');
                                    return Upload.LIST_IGNORE;
                                }

                                return false; // Prevent auto-upload
                            }}
                            onChange={({ fileList: newFileList }) => {
                                setFileList(newFileList);
                            }}
                            listType="picture"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Select Logo</Button>
                        </Upload>
                    </Form.Item>
                    <div className="text-gray-500 text-sm mt-2">
                        Supported formats: JPG, PNG, SVG. Max size: 2MB
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default BrandManagerPage;
import { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Switch,
    Select,
    Space,
    Popconfirm,
    message,
    Tree,
    Card,
    Row,
    Col,
    Tag
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    ReloadOutlined,
    AppstoreOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';
import CategoryService from '../../services/admin/category.service';
import { CategoryDto } from '../../models/Category';
import { DataNode } from 'antd/es/tree';


const CategoriesManagement = () => {
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'tree'

    document.title = 'Admin - Quản lý Danh mục';

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        filterCategories();
    }, [categories, searchText]);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const categoryService = new CategoryService();
            const result = await categoryService.getCategories();

            // Đảm bảo categories là một mảng
            const categoriesData = Array.isArray(result) ? result : [];
            setTimeout(() => {
                setCategories(categoriesData);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error("Error loading categories:", error);
            setCategories([]); // Reset về mảng rỗng khi có lỗi
            setLoading(false);
            message.error("Failed to load categories");
        }
    };

    const filterCategories = () => {
        if (!searchText || !Array.isArray(categories)) {
            setFilteredCategories(Array.isArray(categories) ? categories : []);
            return;
        }

        const filtered = categories.filter(category =>
            category.name.toLowerCase().includes(searchText.toLowerCase()) ||
            category.alias.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredCategories(filtered);
    };
    const handleAdd = () => {
        setEditingCategory(null);
        form.resetFields();
        setModalVisible(true);
    };
    const hasCategoryChildren = (categoryId: number) => {
        return categories.some(cat => cat.parent_id === categoryId);
    };

    const handleEdit = (record: CategoryDto) => {
        // Kiểm tra xem category có category con hay không
        const hasChildren = hasCategoryChildren(record.id);

        // Đảm bảo tất cả các trường đều có giá trị
        const formValues = {
            name: record.name || '',
            alias: record.alias || '',
            parent_id: record.parent_id || undefined,
            image: record.image || '',
            enabled: record.enabled === undefined ? true : !!record.enabled,
            // Thêm biến để theo dõi có con hay không
            hasChildren: hasChildren
        };

        // Lưu lại toàn bộ record để có thể sử dụng sau này
        // Sửa dòng gây lỗi
        setEditingCategory({ ...record, hasChildren } as CategoryDto & { hasChildren: boolean });

        // Mở modal trước, sau đó mới đặt giá trị form (trong useEffect)
        setModalVisible(true);

        // Sử dụng setTimeout để đảm bảo giá trị được set sau khi modal hiển thị
        setTimeout(() => {
            form.setFieldsValue(formValues);
        }, 100);
    };
    const handleDelete = async (id: number) => {
        const hasChildren = categories.some(cat => cat.parent_id === id);
        if (hasChildren) {
            message.error('Cannot delete category with subcategories');
            return;
        }

        setCategories(prev => prev.filter(cat => cat.id !== id));
        const categoryService = new CategoryService();
        await categoryService.deleteCategory(id)
        message.success('Category deleted successfully');
    };

    const handleSubmit = async (values: any) => {
        const categoryService = new CategoryService();

        try {
            if (editingCategory) {
                // Tạo object mới với dữ liệu đã cập nhật
                const updatedCategory = {
                    ...values,
                    id: editingCategory.id, // Giữ nguyên ID
                    // Tính toán lại all_parent_ids nếu parent_id thay đổi
                    all_parent_ids: values.parent_id !== editingCategory.parent_id
                        ? (() => {
                            if (!values.parent_id) return '';

                            const parentCategory = categories.find(c => c.id === values.parent_id);
                            if (!parentCategory || !parentCategory.all_parent_ids) {
                                return values.parent_id.toString();
                            }
                            return `${parentCategory.all_parent_ids},${values.parent_id}`;
                        })()
                        : editingCategory.all_parent_ids
                };

                // Gọi API với dữ liệu đã cập nhật
                console.log("Sending updated category to API:", updatedCategory);
                await categoryService.saveCategory(updatedCategory);

                // Cập nhật state sau khi API thành công
                setCategories(prev => prev.map(cat =>
                    cat.id === editingCategory.id ? updatedCategory : cat
                ));

                message.success('Category updated successfully');
            } else {
                // Xử lý thêm danh mục mới (giữ nguyên code hiện tại)
                const newCategory = {
                    ...values,
                    all_parent_ids: values.parent_id
                        ? (() => {
                            const parentCategory = categories.find(c => c.id === values.parent_id);
                            if (!parentCategory) return values.parent_id.toString();
                            if (!parentCategory.all_parent_ids) return values.parent_id.toString();
                            return `${parentCategory.all_parent_ids},${values.parent_id}`;
                        })()
                        : ''
                };

                const category = await categoryService.saveCategory(newCategory);
                setCategories(prev => [...prev, category]);
                message.success('Category added successfully');
            }

            setModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error("Error saving category:", error);
            message.error('Failed to save category');
        }
    };

    const getParentOptions = () => {
        // Kiểm tra nếu categories không phải là mảng
        if (!Array.isArray(categories)) {
            return [];
        }

        return categories
            .filter(cat => editingCategory ? cat.id !== editingCategory.id : true)
            .map(cat => ({
                value: cat.id,
                label: cat.name,
                disabled: editingCategory && cat.all_parent_ids ?
                    cat.all_parent_ids.split(',').includes(editingCategory.id.toString()) : false
            }));
    };

    const buildTreeData = (): DataNode[] => {
        const categoryMap: Record<number, DataNode & CategoryDto> = {};
        const roots: DataNode[] = [];

        // Create category map
        categories.forEach(cat => {
            categoryMap[cat.id] = {
                ...cat,
                key: cat.id.toString(),
                title: (
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <span>{cat.name}</span>
                            <Tag color={cat.enabled ? 'green' : 'red'}>
                                {cat.enabled ? 'Active' : 'Inactive'}
                            </Tag>
                        </span>
                        <Space>
                            <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(cat)} />
                            <Popconfirm
                                title="Are you sure to delete this category?"
                                onConfirm={() => handleDelete(cat.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button size="small" danger icon={<DeleteOutlined />} />
                            </Popconfirm>
                        </Space>
                    </div>
                ),
                children: []
            };
        });

        // Build tree structure
        categories.forEach(cat => {
            if (cat.parent_id) {
                categoryMap[cat.parent_id]?.children?.push(categoryMap[cat.id]);
            } else {
                roots.push(categoryMap[cat.id]);
            }
        });

        return roots;
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            sorter: (a: any, b: any) => a.id - b.id
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
            render: (text: string, record: CategoryDto) => (
                <div className="flex items-center gap-2">
                    {record.image && (
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">
                            IMG
                        </div>
                    )}
                    <span>{text}</span>
                </div>
            )
        },
        {
            title: 'Alias',
            dataIndex: 'alias',
            key: 'alias',
            render: (text: string) => <code className="bg-gray-100 px-2 py-1 rounded text-sm">{text}</code>
        },
        {
            title: 'Parent',
            key: 'parent',
            render: (_: any, record: CategoryDto) => {
                const parent = categories.find(cat => cat.id === record.parent_id);
                return parent ? (
                    <Tag color="blue">{parent.name}</Tag>
                ) : (
                    <Tag>Root</Tag>
                );
            }
        },
        {
            title: 'Status',
            dataIndex: 'enabled',
            key: 'enabled',
            width: 100,
            render: (enabled: boolean) => (
                <Tag color={enabled ? 'green' : 'red'}>
                    {enabled ? 'Active' : 'Inactive'}
                </Tag>
            ),
            filters: [
                { text: 'Active', value: true },
                { text: 'Inactive', value: false }
            ],
            onFilter: (value: any, record: CategoryDto) => record.enabled === value
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_: any, record: CategoryDto) => (
                <Space>
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Are you sure to delete this category?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Card>
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">Categories Management</h1>
                        <Space>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAdd}
                            >
                                Add Category
                            </Button>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={loadCategories}
                                loading={loading}
                            >
                                Refresh
                            </Button>
                        </Space>
                    </div>

                    <Row gutter={16} className="mb-4">
                        <Col span={12}>
                            <Input
                                placeholder="Search categories..."
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                allowClear
                            />
                        </Col>
                        <Col span={12}>
                            <div className="flex justify-end">
                                <Button.Group>
                                    <Button
                                        type={viewMode === 'table' ? 'primary' : 'default'}
                                        icon={<UnorderedListOutlined />}
                                        onClick={() => setViewMode('table')}
                                    >
                                        Table View
                                    </Button>
                                    <Button
                                        type={viewMode === 'tree' ? 'primary' : 'default'}
                                        icon={<AppstoreOutlined />}
                                        onClick={() => setViewMode('tree')}
                                    >
                                        Tree View
                                    </Button>
                                </Button.Group>
                            </div>
                        </Col>
                    </Row>
                </div>

                {viewMode === 'table' ? (
                    <Table
                        columns={columns}
                        dataSource={filteredCategories}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                        }}
                    />
                ) : (
                    <Tree
                        showLine
                        defaultExpandAll
                        treeData={buildTreeData()}
                    />
                )}
            </Card>

            <Modal
                title={editingCategory ? 'Edit Category' : 'Add Category'}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ enabled: true }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Category Name"
                                rules={[
                                    { required: true, message: 'Please input category name!' },
                                    { max: 128, message: 'Name cannot exceed 128 characters!' }
                                ]}
                            >
                                <Input placeholder="Enter category name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="alias"
                                label="Alias"
                                rules={[
                                    { required: true, message: 'Please input alias!' },
                                    { max: 64, message: 'Alias cannot exceed 64 characters!' },
                                    { pattern: /^[a-z0-9-]+$/, message: 'Alias can only contain lowercase letters, numbers, and hyphens!' }
                                ]}
                            >
                                <Input placeholder="e.g., electronics, fashion" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="parent_id"
                        label="Parent Category"
                    >
                        <Select
                            placeholder="Select parent category (optional)"
                            allowClear
                            options={getParentOptions()}
                            disabled={editingCategory?.hasChildren}
                        />
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="Image"
                    >
                        <Input placeholder="Image filename or URL" />
                    </Form.Item>

                    <Form.Item
                        name="enabled"
                        label="Status"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                    </Form.Item>

                    <Form.Item className="mb-0 flex justify-end">
                        <Space>
                            <Button onClick={() => {
                                setModalVisible(false);
                                form.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingCategory ? 'Update' : 'Create'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoriesManagement;
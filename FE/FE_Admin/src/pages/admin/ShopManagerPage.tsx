import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, Card, Input, Button, Space, Tag, Avatar, Rate,
    Typography, Row, Col, message, Drawer, Divider, Statistic, Switch, Form, Select
} from 'antd';
import {
    SearchOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined,
    ShopOutlined, EnvironmentOutlined, PhoneOutlined, TeamOutlined, SyncOutlined
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import axios from '../../axios.customize';
import dayjs from 'dayjs';
import { Shop } from '../../models/AdminDto';

const { Title, Text, Paragraph } = Typography;

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Record<string, FilterValue>;
}

const ShopManagement: React.FC = () => {
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
    const [currentShop, setCurrentShop] = useState<Shop | null>(null);
    const [searchDrawer, setSearchDrawer] = useState<boolean>(false);
    const [searchForm] = Form.useForm();
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
        },
        sortField: 'name',
        sortOrder: 'ascend',
    });

    document.title = 'Admin - Quản lý Cửa hàng';

    const fetchShops = async (params: TableParams = {}) => {
        setLoading(true);
        try {
            const response = await axios.get('/admin/shop-list', {
                params: {
                    page: params.pagination?.current || 1,
                    pageSize: params.pagination?.pageSize || 10,
                    sortField: params.sortField,
                    sortOrder: params.sortOrder,
                    searchText: searchText,
                    ...params.filters,
                }
            });

            const { data, total } = response.data;

            setShops(data);
            setTableParams(prevParams => ({
                ...prevParams,
                pagination: {
                    ...prevParams.pagination,
                    total,
                },
            }));
        } catch (error) {
            console.error('Error fetching shops:', error);
            message.error('Không thể tải dữ liệu cửa hàng');
        } finally {
            setLoading(false);
        }
    };

    // Sử dụng một ref để theo dõi lần render đầu tiên
    const isFirstRender = React.useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            fetchShops(tableParams);
        }
    }, []);

    // Effect riêng biệt để xử lý các thay đổi tableParams
    useEffect(() => {
        if (!isFirstRender.current) {
            fetchShops(tableParams);
        }
    }, [
        tableParams.pagination?.current,
        tableParams.pagination?.pageSize,
        tableParams.sortField,
        tableParams.sortOrder,
        JSON.stringify(tableParams.filters)
    ]);

    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue>,
        sorter: SorterResult<Shop> | SorterResult<Shop>[]
    ) => {
        const sorterResult = Array.isArray(sorter) ? sorter[0] : sorter;
        const sortField = sorterResult.field as string || 'name';

        let sortOrder = sorterResult.order;
        if (!sortOrder) {
            sortOrder = tableParams.sortField === sortField &&
                tableParams.sortOrder === 'ascend' ? 'descend' : 'ascend';
        }

        setTableParams({
            pagination,
            filters,
            sortField,
            sortOrder,
        });
    };

    const handleSearch = () => {
        // Đặt lại trang về 1 khi tìm kiếm
        setTableParams(prevParams => ({
            ...prevParams,
            pagination: {
                ...prevParams.pagination,
                current: 1,
            },
        }));
    };

    const resetSearch = () => {
        setSearchText('');
        // Đặt lại trang về 1 khi reset tìm kiếm
        setTableParams(prevParams => ({
            ...prevParams,
            pagination: {
                ...prevParams.pagination,
                current: 1,
            },
        }));
    };

    const refreshData = () => {
        fetchShops(tableParams);
    };

    const showShopDetails = (shop: Shop) => {
        setCurrentShop(shop);
        setDetailsVisible(true);
    };

    const handleToggleStatus = async (shop: Shop) => {
        try {
            setLoading(true);
            const newStatus = !shop.enabled;

            await axios.put(`/admin/shop/${shop.id}/toggle-status?enabled=${newStatus}`);
            message.success(`Cửa hàng đã được ${newStatus ? 'kích hoạt' : 'vô hiệu hóa'}!`);

            if (currentShop && currentShop.id === shop.id) {
                setCurrentShop({
                    ...currentShop,
                    enabled: newStatus,
                });
            }

            refreshData();
        } catch (error) {
            console.error('Error updating shop status:', error);
            message.error('Không thể cập nhật trạng thái cửa hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleAdvancedSearch = (values: any) => {
        const filters: Record<string, FilterValue> = {};

        if (values.city) {
            filters.city = [values.city];
        }

        if (values.status !== undefined) {
            filters.enabled = [values.status];
        }

        if (values.rating) {
            filters.rating = [values.rating];
        }

        setTableParams({
            ...tableParams,
            filters,
            pagination: {
                ...tableParams.pagination,
                current: 1,
            },
        });

        setSearchDrawer(false);
    };

    const columns: ColumnsType<Shop> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 120,
            render: (text) => <span className="text-gray-600 font-mono">{text}</span>,
        },
        {
            title: 'Cửa hàng',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            render: (text, record) => (
                <div className="flex items-center">
                    <Avatar
                        src={`${record.photo}`}
                        size={40}
                    />
                    <span className="font-medium ml-3">{text}</span>
                    {!record.enabled && (
                        <Tag color="red" className="ml-2">
                            <CloseCircleOutlined /> Inactive
                        </Tag>
                    )}
                </div>
            ),
        },
        {
            title: 'Thành phố',
            dataIndex: 'city',
            key: 'city',
            filters: [
                { text: 'Hà Nội', value: 'Hà Nội' },
                { text: 'TP.HCM', value: 'TP.HCM' },
                { text: 'Đà Nẵng', value: 'Đà Nẵng' },
                { text: 'Hải Phòng', value: 'Hải Phòng' },
                { text: 'Cần Thơ', value: 'Cần Thơ' },
            ],
            render: (city) => (
                <span>
                    <EnvironmentOutlined className="mr-1 text-blue-500" /> {city}
                </span>
            ),
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            sorter: true,
            render: (rating) => {
                const normalizedRating = rating > 5 ? (5 * (rating / 100) % 5) || 5 : rating;
                return (
                    <div>
                        <Rate disabled defaultValue={normalizedRating} allowHalf style={{ fontSize: '16px' }} />
                        <div className="text-gray-500 mt-1">({rating})</div>
                    </div>
                );
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'enabled',
            key: 'enabled',
            filters: [
                { text: 'Hoạt động', value: true },
                { text: 'Vô hiệu', value: false },
            ],
            render: (enabled, record) => (
                <Switch
                    checked={enabled}
                    checkedChildren="Hoạt động"
                    unCheckedChildren="Vô hiệu"
                    onChange={() => handleToggleStatus(record)}
                />
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 100,
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    size="middle"
                    onClick={() => showShopDetails(record)}
                >
                    Chi tiết
                </Button>
            ),
        },
    ];

    return (
        <div className="shop-management">
            <Card
                title={<Title level={4}>Quản lý Cửa hàng</Title>}
                className="shadow-md mb-4"
                extra={
                    <Space>
                        <Input
                            placeholder="Tìm kiếm cửa hàng..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onPressEnter={handleSearch}
                            style={{ width: 220 }}
                            prefix={<SearchOutlined />}
                            allowClear
                            suffix={
                                searchText ?
                                    <Button
                                        type="text"
                                        size="small"
                                        onClick={resetSearch}
                                        icon={<CloseCircleOutlined />}
                                    /> : null
                            }
                        />
                        <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
                            Tìm kiếm
                        </Button>
                        <Button onClick={() => setSearchDrawer(true)} icon={<SearchOutlined />}>
                            Tìm kiếm nâng cao
                        </Button>
                        <Button onClick={refreshData} icon={<SyncOutlined />}>
                            Làm mới
                        </Button>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={shops}
                    rowKey="id"
                    loading={loading}
                    onChange={handleTableChange}
                    pagination={tableParams.pagination}
                    rowClassName={(record) => !record.enabled ? 'bg-gray-50' : ''}
                    scroll={{ x: 1000 }}
                    sortDirections={['ascend', 'descend']}
                />
            </Card>

            {/* Shop Details Drawer */}
            <Drawer
                title={
                    <div className="flex items-center">
                        <ShopOutlined className="text-blue-500 mr-2" style={{ fontSize: '20px' }} />
                        <span className="text-lg font-semibold">
                            {currentShop?.name}
                        </span>
                        {currentShop && (
                            <Tag color={currentShop.enabled ? 'green' : 'red'} className="ml-3">
                                {currentShop.enabled ?
                                    <><CheckCircleOutlined /> Active</> :
                                    <><CloseCircleOutlined /> Inactive</>
                                }
                            </Tag>
                        )}
                    </div>
                }
                placement="right"
                width={580}
                onClose={() => setDetailsVisible(false)}
                open={detailsVisible}
                extra={
                    currentShop && (
                        <Switch
                            checked={currentShop.enabled}
                            checkedChildren="Hoạt động"
                            unCheckedChildren="Vô hiệu"
                            onChange={() => currentShop && handleToggleStatus(currentShop)}
                        />
                    )
                }
            >
                {currentShop && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-center mb-8">
                            <Avatar
                                src={`${currentShop.photo}`}
                                size={100}
                                className="shadow-md"
                            />
                        </div>

                        <Card className="bg-gray-50">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Text type="secondary">ID:</Text>
                                    <div className="font-medium">{currentShop.id}</div>
                                </div>
                                <div>
                                    <Text type="secondary">Đánh giá:</Text>
                                    <div className="font-medium">{currentShop.rating}</div>
                                </div>
                                {currentShop.createdAt && (
                                    <div>
                                        <Text type="secondary">Ngày tạo:</Text>
                                        <div className="font-medium">
                                            {dayjs(currentShop.createdAt).format('DD/MM/YYYY')}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <Text type="secondary">Thành phố:</Text>
                                    <div className="font-medium">{currentShop.city}</div>
                                </div>
                                <div>
                                    <Text type="secondary">Điện thoại:</Text>
                                    <div className="flex items-center">
                                        <PhoneOutlined className="text-green-500 mr-1" />
                                        <span>{currentShop.phone || 'Chưa cập nhật'}</span>
                                    </div>
                                </div>
                                {currentShop.email && (
                                    <div>
                                        <Text type="secondary">Email:</Text>
                                        <div className="font-medium">{currentShop.email}</div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Divider orientation="left">Địa chỉ</Divider>
                        <div className="bg-white p-4 rounded-md border border-gray-200">
                            <div className="flex items-start">
                                <EnvironmentOutlined className="text-blue-500 mr-2 mt-1" style={{ fontSize: '16px' }} />
                                <Text>{currentShop.address}</Text>
                            </div>
                        </div>

                        <Divider orientation="left">Mô tả</Divider>
                        <div className="bg-white p-4 rounded-md border border-gray-200">
                            <Paragraph>{currentShop.description}</Paragraph>
                        </div>

                        <Divider orientation="left">Thống kê</Divider>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Card>
                                    <Statistic
                                        title="Người theo dõi"
                                        value={currentShop.peopleTracking}
                                        prefix={<TeamOutlined />}
                                        valueStyle={{ color: '#3f8600' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card>
                                    <Statistic
                                        title="Số lượng sản phẩm"
                                        value={currentShop.productAmount}
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        <div className="flex justify-end mt-6">
                            <Button
                                type="primary"
                                onClick={() => setDetailsVisible(false)}
                            >
                                Đóng
                            </Button>
                        </div>
                    </div>
                )}
            </Drawer>

            {/* Advanced Search Drawer */}
            <Drawer
                title="Tìm kiếm nâng cao"
                width={360}
                open={searchDrawer}
                onClose={() => setSearchDrawer(false)}
                footer={
                    <Space style={{ float: 'right' }}>
                        <Button onClick={() => {
                            searchForm.resetFields();
                            setSearchDrawer(false);
                            resetSearch();
                        }}>
                            Đặt lại
                        </Button>
                        <Button type="primary" onClick={() => {
                            searchForm.validateFields().then(values => {
                                handleAdvancedSearch(values);
                            });
                        }}>
                            Áp dụng
                        </Button>
                    </Space>
                }
            >
                <Form
                    form={searchForm}
                    layout="vertical"
                >
                    <Form.Item name="city" label="Thành phố">
                        <Select placeholder="Chọn thành phố" allowClear>
                            <Select.Option value="Hà Nội">Hà Nội</Select.Option>
                            <Select.Option value="TP.HCM">TP.HCM</Select.Option>
                            <Select.Option value="Đà Nẵng">Đà Nẵng</Select.Option>
                            <Select.Option value="Hải Phòng">Hải Phòng</Select.Option>
                            <Select.Option value="Cần Thơ">Cần Thơ</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="status" label="Trạng thái">
                        <Select placeholder="Chọn trạng thái" allowClear>
                            <Select.Option value={true}>Hoạt động</Select.Option>
                            <Select.Option value={false}>Vô hiệu</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="rating" label="Đánh giá tối thiểu">
                        <Rate allowHalf />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default ShopManagement;
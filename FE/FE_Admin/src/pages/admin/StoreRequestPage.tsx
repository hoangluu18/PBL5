import React, { useState, useEffect } from 'react';
import {
    Table,
    Card,
    Button,
    Space,
    Tag,
    Modal,
    Form,
    Input,
    message,
    Tooltip,
    Row,
    Col,
    Statistic,
    Avatar,
    Typography,
    Select,
    DatePicker,
    Empty,
    Popconfirm
} from 'antd';
import {
    EyeOutlined,
    CheckOutlined,
    CloseOutlined,
    ShopOutlined,
    UserOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    FileTextOutlined,
    ReloadOutlined,
    SearchOutlined,
    FilterOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { StoreRequest } from '../../models/StoreRequestDto';
import StoreRequestService from '../../services/admin/store_request_service';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface RequestStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

const StoreRequestPage: React.FC = () => {
    const [requests, setRequests] = useState<StoreRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<StoreRequest | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [responseModalVisible, setResponseModalVisible] = useState(false);
    const [responseType, setResponseType] = useState<'approve' | 'reject'>('approve');
    const [form] = Form.useForm();
    const [stats, setStats] = useState<RequestStats>({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    });

    // Filter states
    const [filteredRequests, setFilteredRequests] = useState<StoreRequest[]>([]);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    document.title = 'Admin - Quản lý yêu cầu đăng ký cửa hàng';

    useEffect(() => {
        applyFilters();
    }, [requests, searchText, statusFilter, dateRange]);

    // Hàm tính toán và cập nhật stats
    const calculateStats = (requestList: StoreRequest[]): RequestStats => {
        return {
            total: requestList.length,
            pending: requestList.filter(r => r.status === 0).length,
            approved: requestList.filter(r => r.status === 1).length,
            rejected: requestList.filter(r => r.status === 2).length,
        };
    };

    // Hàm cập nhật stats
    const updateStats = (requestList: StoreRequest[]) => {
        const newStats = calculateStats(requestList);
        setStats(newStats);
        console.log('📊 Stats updated:', newStats);
    };

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const storeRequestService = new StoreRequestService();
            const data = await storeRequestService.getAll();

            console.log('📥 Fetched requests:', data);
            setRequests(data);

            // Cập nhật stats sau khi fetch
            updateStats(data);

        } catch (error) {
            console.error('❌ Error fetching requests:', error);
            message.error('Không thể tải danh sách yêu cầu');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...requests];

        // Search filter
        if (searchText) {
            filtered = filtered.filter(request =>
                request.storeName.toLowerCase().includes(searchText.toLowerCase()) ||
                request.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
                request.customerEmail.toLowerCase().includes(searchText.toLowerCase()) ||
                request.phoneNumber.includes(searchText)
            );
        }

        // Status filter
        if (statusFilter !== undefined) {
            filtered = filtered.filter(request => request.status === statusFilter);
        }

        // Date range filter
        if (dateRange) {
            filtered = filtered.filter(request => {
                const requestDate = dayjs(request.requestDate);
                return requestDate.isAfter(dateRange[0].startOf('day')) &&
                    requestDate.isBefore(dateRange[1].endOf('day'));
            });
        }

        setFilteredRequests(filtered);
    };

    const getStatusTag = (status: number) => {
        switch (status) {
            case 0:
                return <Tag color="orange" icon={<ClockCircleOutlined />}>Chờ xử lý</Tag>;
            case 1:
                return <Tag color="green" icon={<CheckOutlined />}>Đã phê duyệt</Tag>;
            case 2:
                return <Tag color="red" icon={<CloseOutlined />}>Đã từ chối</Tag>;
            default:
                return <Tag>Không xác định</Tag>;
        }
    };

    const showDetailModal = (request: StoreRequest) => {
        setSelectedRequest(request);
        setDetailModalVisible(true);
    };

    // Hàm phê duyệt nhanh
    const handleQuickApprove = async (request: StoreRequest) => {
        try {
            console.log('🚀 Quick approve request:', request.id);

            const storeRequestService = new StoreRequestService();
            await storeRequestService.updateStatus(
                request.id,
                'approve',
                'Đã phê duyệt nhanh'
            );

            // Cập nhật local state
            const updatedRequests = requests.map(req => {
                if (req.id === request.id) {
                    return {
                        ...req,
                        status: 1,
                        responseDate: new Date().toISOString(),
                        responseNote: 'Đã phê duyệt nhanh'
                    };
                }
                return req;
            });

            console.log('✅ Updated requests after quick approve');
            setRequests(updatedRequests);

            // Cập nhật stats
            updateStats(updatedRequests);

            message.success(`Đã phê duyệt yêu cầu "${request.storeName}" thành công`);

        } catch (error) {
            console.error('❌ Error quick approving request:', error);
            message.error('Có lỗi xảy ra khi phê duyệt yêu cầu');
        }
    };

    const showResponseModal = (request: StoreRequest, type: 'approve' | 'reject') => {
        setSelectedRequest(request);
        setResponseType(type);
        setResponseModalVisible(true);
        form.resetFields();
    };

    // Hàm xử lý phản hồi với ghi chú
    const handleResponse = async (values: any) => {
        if (!selectedRequest) return;

        try {
            console.log('🔄 Processing response for request:', selectedRequest.id);
            console.log('📝 Response type:', responseType);
            console.log('💬 Response note:', values.responseNote);

            const note = values.responseNote || (responseType === 'approve' ? 'Đã phê duyệt' : 'Đã từ chối');

            const storeRequestService = new StoreRequestService();
            await storeRequestService.updateStatus(
                selectedRequest.id,
                responseType,
                note
            );

            // Cập nhật local state
            const updatedRequests = requests.map(request => {
                if (request.id === selectedRequest.id) {
                    return {
                        ...request,
                        status: responseType === 'approve' ? 1 : 2,
                        responseDate: new Date().toISOString(),
                        responseNote: note
                    };
                }
                return request;
            });

            console.log('✅ Updated requests after response');
            setRequests(updatedRequests);

            // Cập nhật stats
            updateStats(updatedRequests);

            const successMessage = `Đã ${responseType === 'approve' ? 'phê duyệt' : 'từ chối'} yêu cầu "${selectedRequest.storeName}" thành công`;
            message.success(successMessage);

            setResponseModalVisible(false);
            form.resetFields();

        } catch (error) {
            console.error('❌ Error processing response:', error);
            message.error('Có lỗi xảy ra khi xử lý yêu cầu');
        }
    };

    // Hàm refresh
    const handleRefresh = () => {
        console.log('🔄 Refreshing data...');
        fetchRequests();
    };

    // Hàm clear filters
    const handleClearFilters = () => {
        console.log('🧹 Clearing filters...');
        setSearchText('');
        setStatusFilter(undefined);
        setDateRange(null);
    };

    const columns: ColumnsType<StoreRequest> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Thông tin khách hàng',
            key: 'customer_info',
            width: 200,
            render: (_, record) => (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                        <Avatar icon={<UserOutlined />} size="small" style={{ marginRight: 8 }} />
                        <Text strong>{record.customerName}</Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.customerEmail}</Text>
                </div>
            ),
        },
        {
            title: 'Tên cửa hàng',
            dataIndex: 'storeName',
            key: 'storeName',
            width: 180,
            sorter: (a, b) => a.storeName.localeCompare(b.storeName),
            render: (text) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ShopOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    <Text strong>{text}</Text>
                </div>
            ),
        },
        {
            title: 'Liên hệ',
            key: 'contact',
            width: 120,
            render: (_, record) => (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                        <PhoneOutlined style={{ marginRight: 4, fontSize: '12px' }} />
                        <Text style={{ fontSize: '12px' }}>{record.phoneNumber}</Text>
                    </div>
                    <Tooltip title={record.address}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <EnvironmentOutlined style={{ marginRight: 4, fontSize: '12px' }} />
                            <Text ellipsis style={{ fontSize: '12px', maxWidth: 100 }}>
                                {record.address}
                            </Text>
                        </div>
                    </Tooltip>
                </div>
            ),
        },
        {
            title: 'Ngày gửi',
            dataIndex: 'requestDate',
            key: 'requestDate',
            width: 120,
            sorter: (a, b) => dayjs(a.requestDate).unix() - dayjs(b.requestDate).unix(),
            render: (date) => (
                <div>
                    <div>{dayjs(date).format('DD/MM/YYYY')}</div>
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                        {dayjs(date).format('HH:mm')}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            filters: [
                { text: 'Chờ xử lý', value: 0 },
                { text: 'Đã phê duyệt', value: 1 },
                { text: 'Đã từ chối', value: 2 },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => getStatusTag(status),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => showDetailModal(record)}
                        />
                    </Tooltip>

                    {record.status === 0 && (
                        <>
                            <Tooltip title="Phê duyệt nhanh">
                                <Popconfirm
                                    title="Xác nhận phê duyệt"
                                    description={`Bạn có chắc chắn muốn phê duyệt cửa hàng "${record.storeName}"?`}
                                    onConfirm={() => handleQuickApprove(record)}
                                    okText="Phê duyệt"
                                    cancelText="Hủy"
                                    okType="primary"
                                >
                                    <Button
                                        type="text"
                                        icon={<CheckOutlined />}
                                        style={{ color: '#52c41a' }}
                                    />
                                </Popconfirm>
                            </Tooltip>

                            <Tooltip title="Từ chối với ghi chú">
                                <Button
                                    type="text"
                                    icon={<CloseOutlined />}
                                    style={{ color: '#ff4d4f' }}
                                    onClick={() => showResponseModal(record, 'reject')}
                                />
                            </Tooltip>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                    <ShopOutlined style={{ marginRight: 12, color: '#1890ff' }} />
                    Quản lý yêu cầu đăng ký cửa hàng
                </Title>
                <Text type="secondary">Xem và xử lý các yêu cầu đăng ký trở thành người bán</Text>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Tổng yêu cầu"
                            value={stats.total}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Chờ xử lý"
                            value={stats.pending}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Đã phê duyệt"
                            value={stats.approved}
                            prefix={<CheckOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Đã từ chối"
                            value={stats.rejected}
                            prefix={<CloseOutlined />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={8}>
                        <Input
                            placeholder="Tìm kiếm theo tên cửa hàng, khách hàng, email..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={4}>
                        <Select
                            placeholder="Trạng thái"
                            style={{ width: '100%' }}
                            value={statusFilter}
                            onChange={(value) => setStatusFilter(value)}
                            allowClear
                        >
                            <Option value={0}>Chờ xử lý</Option>
                            <Option value={1}>Đã phê duyệt</Option>
                            <Option value={2}>Đã từ chối</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={6}>
                        <RangePicker
                            style={{ width: '100%' }}
                            value={dateRange}
                            onChange={(dates) => setDateRange(dates)}
                            format="DD/MM/YYYY"
                            placeholder={['Từ ngày', 'Đến ngày']}
                        />
                    </Col>
                    <Col xs={24} sm={6}>
                        <Space>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={handleRefresh}
                                loading={loading}
                            >
                                Làm mới
                            </Button>
                            <Button
                                icon={<FilterOutlined />}
                                onClick={handleClearFilters}
                            >
                                Xóa bộ lọc
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredRequests}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        total: filteredRequests.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} yêu cầu`,
                    }}
                    locale={{
                        emptyText: (
                            <Empty
                                description="Không có yêu cầu nào"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        ),
                    }}
                />
            </Card>

            {/* Detail Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <EyeOutlined style={{ marginRight: 8 }} />
                        Chi tiết yêu cầu đăng ký
                    </div>
                }
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                width={700}
                footer={null}
            >
                {selectedRequest && (
                    <div>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Card size="small" title="Thông tin khách hàng">
                                    <Row gutter={[16, 8]}>
                                        <Col span={12}>
                                            <Text strong>Họ tên:</Text> {selectedRequest.customerName}
                                        </Col>
                                        <Col span={12}>
                                            <Text strong>Email:</Text> {selectedRequest.customerEmail}
                                        </Col>
                                        <Col span={12}>
                                            <Text strong>Số điện thoại:</Text> {selectedRequest.phoneNumber}
                                        </Col>
                                        <Col span={12}>
                                            <Text strong>ID khách hàng:</Text> {selectedRequest.customerId}
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>

                            <Col span={24}>
                                <Card size="small" title="Thông tin cửa hàng">
                                    <Row gutter={[16, 8]}>
                                        <Col span={24}>
                                            <Text strong>Tên cửa hàng:</Text> {selectedRequest.storeName}
                                        </Col>
                                        <Col span={24}>
                                            <Text strong>Địa chỉ:</Text> {selectedRequest.address}
                                        </Col>
                                        <Col span={24}>
                                            <Text strong>Mô tả:</Text>
                                            <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
                                                {selectedRequest.description}
                                            </Paragraph>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>

                            <Col span={24}>
                                <Card size="small" title="Thông tin xử lý">
                                    <Row gutter={[16, 8]}>
                                        <Col span={12}>
                                            <Text strong>Ngày gửi:</Text> {dayjs(selectedRequest.requestDate).format('DD/MM/YYYY HH:mm')}
                                        </Col>
                                        <Col span={12}>
                                            <Text strong>Trạng thái:</Text> {getStatusTag(selectedRequest.status)}
                                        </Col>
                                        {selectedRequest.responseDate && (
                                            <>
                                                <Col span={12}>
                                                    <Text strong>Ngày phản hồi:</Text> {dayjs(selectedRequest.responseDate).format('DD/MM/YYYY HH:mm')}
                                                </Col>
                                                <Col span={24}>
                                                    <Text strong>Ghi chú phản hồi:</Text>
                                                    <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
                                                        {selectedRequest.responseNote || 'Không có ghi chú'}
                                                    </Paragraph>
                                                </Col>
                                            </>
                                        )}
                                    </Row>
                                </Card>
                            </Col>
                        </Row>

                        {selectedRequest.status === 0 && (
                            <div style={{ marginTop: 16, textAlign: 'center' }}>
                                <Space>
                                    <Button
                                        type="primary"
                                        icon={<CheckOutlined />}
                                        onClick={() => {
                                            setDetailModalVisible(false);
                                            showResponseModal(selectedRequest, 'approve');
                                        }}
                                    >
                                        Phê duyệt với ghi chú
                                    </Button>
                                    <Button
                                        danger
                                        icon={<CloseOutlined />}
                                        onClick={() => {
                                            setDetailModalVisible(false);
                                            showResponseModal(selectedRequest, 'reject');
                                        }}
                                    >
                                        Từ chối
                                    </Button>
                                </Space>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Response Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {responseType === 'approve' ? (
                            <CheckOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                        ) : (
                            <CloseOutlined style={{ marginRight: 8, color: '#ff4d4f' }} />
                        )}
                        {responseType === 'approve' ? 'Phê duyệt yêu cầu' : 'Từ chối yêu cầu'}
                    </div>
                }
                open={responseModalVisible}
                onCancel={() => {
                    setResponseModalVisible(false);
                    form.resetFields();
                }}
                onOk={form.submit}
                okText={responseType === 'approve' ? 'Phê duyệt' : 'Từ chối'}
                cancelText="Hủy"
                okButtonProps={{
                    danger: responseType === 'reject',
                    type: responseType === 'approve' ? 'primary' : 'default'
                }}
            >
                {selectedRequest && (
                    <div>
                        <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 6 }}>
                            <Text strong>Cửa hàng:</Text> {selectedRequest.storeName}
                            <br />
                            <Text strong>Khách hàng:</Text> {selectedRequest.customerName}
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleResponse}
                        >
                            <Form.Item
                                label={`Ghi chú ${responseType === 'approve' ? 'phê duyệt' : 'từ chối'}`}
                                name="responseNote"
                                rules={responseType === 'reject' ? [
                                    { required: true, message: 'Vui lòng nhập lý do từ chối!' }
                                ] : []}
                            >
                                <TextArea
                                    rows={4}
                                    placeholder={
                                        responseType === 'approve'
                                            ? 'Nhập ghi chú phê duyệt (tùy chọn)...'
                                            : 'Nhập lý do từ chối...'
                                    }
                                />
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default StoreRequestPage;
import React, { useContext, useEffect, useState } from "react";
import {
    Layout,
    Typography,
    Table,
    Card,
    Menu,
    Button,
    Checkbox,
    Select,
    DatePicker,
    Space,
    Tag,
    Tooltip,
    message,
    Input
} from "antd";
import {
    ReloadOutlined,
    StarFilled,
    StarOutlined,
    SearchOutlined,
    PrinterOutlined,
    FileTextOutlined,
    DownloadOutlined,
} from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import moment from "moment";
import dayjs from "dayjs";
// Cập nhật interfaces

import { AuthContext } from "../../../utils/auth.context";
import OrderService from "../../../services/order.service";
import InvoiceDetailComponent from "./InvoiceDetail";
import { OrderOverviewDto, SearchOrderDto } from "../../../models/OrderDto";
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Constants
const ORDER_STATUS = {
    PROCESSING: "PROCCESSING",
    DELIVERED: "DELIVERED",
    RETURNED: "RETURNED",
    SHIPPING: "SHIPPING",
    NEW: "NEW",
};

const ORDER_STATUS_COLORS = {
    [ORDER_STATUS.PROCESSING]: "blue",
    [ORDER_STATUS.DELIVERED]: "green",
    [ORDER_STATUS.RETURNED]: "red",
    [ORDER_STATUS.SHIPPING]: "orange"
};

const ORDER_STATUS_LABELS = {
    [ORDER_STATUS.NEW]: "Tạo mới",
    [ORDER_STATUS.PROCESSING]: "Đang xử lý",
    [ORDER_STATUS.SHIPPING]: "Đang giao",
    [ORDER_STATUS.DELIVERED]: "Hoàn thành",
    [ORDER_STATUS.RETURNED]: "Trả hàng",
};

const PAYMENT_METHODS = {
    COD: "COD",
    PAYPAL: "PAYPAL",
    CREDIT_CARD: "CREDIT_CARD"
};

const InvoiceManagementPage: React.FC = () => {
    // State management
    const [selectedInvoice, setSelectedInvoice] = useState<{
        invoiceId?: string;
        date?: string;
        orderId?: string;
    } | undefined>(undefined);
    const [detailVisible, setDetailVisible] = useState(false);
    const [invoices, setInvoices] = useState<OrderOverviewDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [starredInvoices, setStarredInvoices] = useState<string[]>([]);
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useContext(AuthContext);
    document.title = "Quản lý hóa đơn";
    // Default search parameters
    const [searchParams, setSearchParams] = useState<SearchOrderDto>({
        orderTimeFrom: dayjs().startOf('month').format('YYYY-MM-DD'),
        orderTimeTo: dayjs().endOf('month').format('YYYY-MM-DD'),
        orderStatus: [],
        paymentMethod: [],
        deliveryDateFrom: '',
        deliveryDateTo: '',
        city: '',
        shopId: user?.id,
        keyword: '', // Thêm trường keyword cho tìm kiếm
    });

    const [provinces, setProvinces] = useState<{ value: string, label: string }[]>([]);

    // Fetch data on searchParams change
    useEffect(() => {
        fetchData();
        fetchProvinces()
    }, [searchParams]);

    const fetchProvinces = async () => {
        try {
            const response = await axios.get('https://pmshoanghot-apitinhthanhdocker.hf.space/api/list');
            if (response.data) {
                // Transform the API data to match our Select component format
                const formattedProvinces = response.data.map((province: any) => ({
                    value: province.name,
                    label: province.name
                }));
                setProvinces(formattedProvinces);
            }
        } catch (error) {
            console.error('Error fetching provinces:', error);
            // Fallback to static data if API fails
            setProvinces([

            ]);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const orderService = new OrderService();

            // Tạo một đối tượng params API mới thay vì sửa đổi searchParams
            const apiParams: Record<string, any> = {};

            // Chỉ thêm các trường có giá trị
            if (searchParams.orderTimeFrom) apiParams.orderTimeFrom = searchParams.orderTimeFrom;
            if (searchParams.orderTimeTo) apiParams.orderTimeTo = searchParams.orderTimeTo;

            // Xử lý mảng paymentMethod
            if (searchParams.paymentMethod?.length > 0) {
                apiParams.paymentMethod = searchParams.paymentMethod.join(',');
            }

            // Xử lý mảng orderStatus
            if (searchParams.orderStatus?.length > 0) {
                apiParams.orderStatus = searchParams.orderStatus.join(',');
            }

            // Chỉ thêm các trường khác nếu có giá trị
            if (searchParams.keyword?.trim()) apiParams.keyword = searchParams.keyword.trim();
            if (searchParams.city) apiParams.city = searchParams.city;
            if (searchParams.deliveryDateFrom) apiParams.deliveryDateFrom = searchParams.deliveryDateFrom;
            if (searchParams.deliveryDateTo) apiParams.deliveryDateTo = searchParams.deliveryDateTo;
            if (searchParams.shopId) apiParams.shopId = searchParams.shopId;

            // Gọi API với apiParams thay vì params
            const response = await orderService.getOrder(apiParams as SearchOrderDto);
            setInvoices(response);
            message.success(`Đã tải ${response.length} hóa đơn`);
        } catch (error) {
            console.error('Error fetching invoice data:', error);
            message.error('Không thể tải dữ liệu hóa đơn');
        } finally {
            setLoading(false);
        }
    };

    // Update search params
    const updateSearchParams = (key: keyof SearchOrderDto, value: any) => {
        setSearchParams((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // Handle date range changes
    const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
        if (dates && dates[0] && dates[1]) {
            updateSearchParams('orderTimeFrom', dates[0].startOf('day').format('YYYY-MM-DD'));
            updateSearchParams('orderTimeTo', dates[1].endOf('day').format('YYYY-MM-DD'));
        } else {
            updateSearchParams('orderTimeFrom', '');
            updateSearchParams('orderTimeTo', '');
        }
    };

    const handleDeliveryDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
        if (dates && dates[0] && dates[1]) {
            updateSearchParams('deliveryDateFrom', dates[0].startOf('day').format('YYYY-MM-DD'));
            updateSearchParams('deliveryDateTo', dates[1].endOf('day').format('YYYY-MM-DD'));
        } else {
            updateSearchParams('deliveryDateFrom', '');
            updateSearchParams('deliveryDateTo', '');
        }
    };

    // Handle status filter changes
    const handleStatusChange = (status: string, checked: boolean) => {
        const updatedStatus = checked
            ? [...searchParams.orderStatus, status]
            : searchParams.orderStatus.filter((s) => s !== status);
        updateSearchParams('orderStatus', updatedStatus);
    };

    // Handle payment method filter changes
    const handlePaymentMethodChange = (method: string, checked: boolean) => {
        const updatedMethods = checked
            ? [...searchParams.paymentMethod, method]
            : searchParams.paymentMethod.filter((m) => m !== method);
        updateSearchParams('paymentMethod', updatedMethods);
    };

    // Handle location filter changes
    const handleLocationChange = (province: string | undefined) => {
        updateSearchParams('city', province || '');
    };

    // Reset all filters
    const handleReset = () => {
        setSearchParams({
            orderTimeFrom: moment().startOf('month').format('YYYY-MM-DD'),
            orderTimeTo: moment().endOf('month').format('YYYY-MM-DD'),
            orderStatus: [],
            paymentMethod: [],
            deliveryDateFrom: '',
            deliveryDateTo: '',
            city: '',
            shopId: user?.id,
            keyword: '',
        });
        setSelectedRowKeys([]);
        message.info('Đã đặt lại bộ lọc');
    };

    // Handle keyword search
    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSearchParams('keyword', e.target.value);
    };

    const handleSearch = () => {
        fetchData();
        message.info('Đang tìm kiếm...');
    };

    // Toggle starred status
    const toggleStarred = (orderId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setStarredInvoices(prev =>
            prev.includes(orderId.toString())
                ? prev.filter(id => id !== orderId.toString())
                : [...prev, orderId.toString()]
        );
    };

    // Handle invoice selection
    const handleRowClick = (record: any) => {
        setSelectedInvoice(record);
        setDetailVisible(true);
    };

    const handleDetailClose = () => {
        setDetailVisible(false);
    };

    const handleUpdateInvoice = (updatedInvoice: any) => {
        // Cập nhật lại danh sách invoices với dữ liệu mới
        setInvoices(prevInvoices =>
            prevInvoices.map(inv =>
                inv.orderId === updatedInvoice.orderId ? { ...inv, ...updatedInvoice } : inv
            )
        );

        // Cập nhật selectedInvoice nếu đó là invoice đang được chọn
        if (selectedInvoice?.orderId === updatedInvoice.orderId) {
            setSelectedInvoice(updatedInvoice);
        }
    };

    // Handle bulk selection
    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };

    const handleExportMultiplePdf = async () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Vui lòng chọn ít nhất một hóa đơn để xuất PDF');
            return;
        }

        try {
            const orderService = new OrderService();
            const orderIds: number[] = selectedRowKeys.map((key) => parseInt(key.toString(), 10));

            const zipBlob = await orderService.exportMultiplePdf(orderIds);

            // Tạo URL cho blob và tải xuống
            const url = window.URL.createObjectURL(zipBlob);
            const link = document.createElement('a');
            link.href = url;
            // Quan trọng: Thay đổi extension từ .pdf thành .zip
            link.setAttribute('download', `invoices-batch-${new Date().getTime()}.zip`);
            document.body.appendChild(link);
            link.click();

            // Clean up
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
            }, 100);

            message.success(`Đã xuất ${selectedRowKeys.length} hóa đơn vào file ZIP`);
        } catch (error) {
            console.error('Failed to export ZIP file:', error);
            message.error('Xuất file thất bại');
        }
    };

    // Table columns configuration
    const columns = [
        {
            title: '',
            dataIndex: 'star',
            key: 'star',
            width: 40,
            render: (_: any, record: OrderOverviewDto) => (
                <Tooltip title={starredInvoices.includes(record.orderId.toString()) ? "Bỏ đánh dấu sao" : "Đánh dấu sao"}>
                    {starredInvoices.includes(record.orderId.toString()) ? (
                        <StarFilled
                            style={{ color: '#faad14' }}
                            onClick={(e) => toggleStarred(record.orderId.toString(), e)}
                        />
                    ) : (
                        <StarOutlined
                            style={{ color: '#d9d9d9' }}
                            onClick={(e) => toggleStarred(record.orderId.toString(), e)}
                        />
                    )}
                </Tooltip>
            ),
        },
        {
            title: 'Mã hóa đơn',
            dataIndex: 'orderId',
            key: 'orderId',
            render: (id: string) => (
                <Text strong style={{ color: '#1890ff' }}>{id}</Text>
            )
        },
        {
            title: 'Thời gian',
            dataIndex: 'orderTime',
            key: 'orderTime',
            render: (orderTime: string) => (
                <Tooltip title={moment(orderTime).format('DD/MM/YYYY HH:mm:ss')}>
                    {moment(orderTime).format('DD/MM/YYYY')}
                </Tooltip>
            ),
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            width: 150,
            render: (method: string) => {
                const methodColors = {
                    [PAYMENT_METHODS.COD]: 'volcano',
                    [PAYMENT_METHODS.CREDIT_CARD]: 'purple',
                    [PAYMENT_METHODS.PAYPAL]: 'geekblue',
                };

                return <Tag color={methodColors[method as keyof typeof methodColors] || 'default'}>{method}</Tag>;
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render: (status: string) => (
                <Tag color={ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS] || 'default'}>
                    {ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] || status}
                </Tag>
            )
        },
        {
            title: 'Tổng tiền hàng',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            align: 'right' as const,
            render: (amount: number) => (
                <Text strong>{amount.toLocaleString('vi-VN')} ₫</Text>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            render: (_: any, record: OrderOverviewDto) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<FileTextOutlined />}
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(record);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="In hóa đơn">
                        <Button
                            type="text"
                            icon={<PrinterOutlined />}
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                message.success(`Đã gửi hóa đơn ${record.orderId} đến máy in`);
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }} className="invoice-management">
            <Layout>
                {/* Sidebar */}
                <Sider
                    width={260}
                    theme="light"
                    collapsible
                    collapsed={collapsed}
                    onCollapse={setCollapsed}
                    style={{
                        borderRight: '1px solid #f0f0f0',
                        padding: collapsed ? '8px 0' : '16px 8px',
                        backgroundColor: '#fff',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                        overflowY: 'auto',
                        height: '100vh',
                        position: 'sticky',
                        top: 0,
                        left: 0,
                    }}
                >
                    {!collapsed && (
                        <>
                            <Title level={4} style={{ padding: '0 16px', marginBottom: 16 }}>
                                Quản lý hóa đơn
                            </Title>

                            {/* Order time filter */}
                            <Card
                                title="Thời gian đặt hàng"
                                size="small"
                                styles={{
                                    header: { padding: '0 16px', fontSize: '14px', fontWeight: 600 },
                                    body: { padding: '8px 16px' }
                                }}
                                style={{ marginBottom: 16, border: '1px solid #f0f0f0' }}
                                variant="borderless"
                            >
                                <RangePicker
                                    style={{ width: '100%' }}
                                    format="DD/MM/YYYY"
                                    allowClear
                                    value={[
                                        searchParams.orderTimeFrom ? dayjs(searchParams.orderTimeFrom, 'YYYY-MM-DD') : null,
                                        searchParams.orderTimeTo ? dayjs(searchParams.orderTimeTo, 'YYYY-MM-DD') : null,
                                    ]}
                                    onChange={handleDateRangeChange}
                                />
                            </Card>

                            {/* Status filter */}
                            <Card
                                title="Trạng thái"
                                size="small"
                                styles={{
                                    header: { padding: '0 16px', fontSize: '14px', fontWeight: 600 },
                                    body: { padding: '8px 16px' }
                                }}
                                style={{ marginBottom: 16, border: '1px solid #f0f0f0' }}
                                variant="borderless"
                            >
                                <Menu
                                    mode="vertical"
                                    style={{ border: 'none' }}
                                    items={Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => ({
                                        key: key,
                                        label: (
                                            <Checkbox
                                                checked={searchParams.orderStatus.includes(key)}
                                                onChange={(e) => handleStatusChange(key, e.target.checked)}
                                            >
                                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Tag color={ORDER_STATUS_COLORS[key as keyof typeof ORDER_STATUS_COLORS]} style={{ marginRight: 8 }}>•</Tag>
                                                    {label}
                                                </span>
                                            </Checkbox>
                                        )
                                    }))}
                                />
                            </Card>

                            {/* Delivery time filter */}
                            <Card
                                title="Thời gian giao hàng"
                                size="small"
                                styles={{
                                    header: { padding: '0 16px', fontSize: '14px', fontWeight: 600 },
                                    body: { padding: '8px 16px' }
                                }}
                                style={{ marginBottom: 16, border: '1px solid #f0f0f0' }}
                                variant="borderless"
                            >
                                <RangePicker
                                    style={{ width: '100%' }}
                                    format="DD/MM/YYYY"
                                    allowClear
                                    value={[
                                        searchParams.deliveryDateFrom ? dayjs(searchParams.deliveryDateFrom, 'YYYY-MM-DD') : null,
                                        searchParams.deliveryDateTo ? dayjs(searchParams.deliveryDateTo, 'YYYY-MM-DD') : null,
                                    ]}
                                    onChange={handleDeliveryDateRangeChange}
                                />
                            </Card>

                            {/* Location filter */}
                            <Card
                                title="Khu vực giao hàng"
                                size="small"
                                styles={{
                                    header: { padding: '0 16px', fontSize: '14px', fontWeight: 600 },
                                    body: { padding: '8px 16px' }
                                }}
                                style={{ marginBottom: 16, border: '1px solid #f0f0f0' }}
                                variant="borderless"
                            >
                                <Select
                                    placeholder="Chọn Tỉnh/TP"
                                    style={{ width: '100%' }}
                                    value={searchParams.city || undefined}
                                    onChange={handleLocationChange}
                                    allowClear
                                >
                                    {provinces.map(province => (
                                        <Option key={province.value} value={province.value}>{province.label}</Option>
                                    ))}
                                </Select>
                            </Card>

                            {/* Payment method filter */}
                            <Card
                                title="Phương thức thanh toán"
                                size="small"
                                styles={{
                                    header: { padding: '0 16px', fontSize: '14px', fontWeight: 600 },
                                    body: { padding: '8px 16px' }
                                }}
                                style={{ marginBottom: 16, border: '1px solid #f0f0f0' }}
                                variant="borderless"
                            >
                                <Menu
                                    mode="vertical"
                                    style={{ border: 'none' }}
                                    items={Object.entries(PAYMENT_METHODS).map(([key, value]) => ({
                                        key: key,
                                        label: (
                                            <Checkbox
                                                checked={searchParams.paymentMethod.includes(value)}
                                                onChange={(e) => handlePaymentMethodChange(value, e.target.checked)}
                                            >
                                                {value}
                                            </Checkbox>
                                        )
                                    }))}
                                />
                            </Card>

                            {/* Reset button */}
                            <Button
                                type="primary"
                                icon={<ReloadOutlined />}
                                style={{ width: '100%', marginTop: 8 }}
                                onClick={handleReset}
                            >
                                Đặt lại bộ lọc
                            </Button>
                        </>
                    )}
                </Sider>

                {/* Main content */}
                <Content
                    style={{
                        padding: '16px 24px',
                        backgroundColor: '#f0f2f5',
                        minHeight: '100vh'
                    }}
                >
                    <Card
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Title level={4} style={{ margin: 0 }}>Danh sách hóa đơn</Title>
                                <Space>
                                    <div>
                                        {selectedRowKeys.length > 0 ? (
                                            <span>Đã chọn {selectedRowKeys.length} hóa đơn</span>
                                        ) : null}
                                    </div>
                                    <div>
                                        {selectedRowKeys.length > 0 && (
                                            <Button
                                                type="primary"
                                                icon={<DownloadOutlined />}
                                                onClick={handleExportMultiplePdf}
                                            >
                                                Xuất {selectedRowKeys.length} hóa đơn
                                            </Button>
                                        )}
                                    </div>
                                </Space>
                            </div>
                        }
                        extra={
                            <Space size="middle">
                                <Input.Search
                                    placeholder="Tìm theo mã hóa đơn, tên khách hàng"
                                    value={searchParams.keyword}
                                    onChange={handleKeywordChange}
                                    onSearch={handleSearch}
                                    style={{ width: 300 }}
                                    enterButton={<Button type="primary" icon={<SearchOutlined />}>Tìm kiếm</Button>}
                                    allowClear
                                />
                                <Button
                                    type="default"
                                    icon={<ReloadOutlined />}
                                    onClick={handleReset}
                                >
                                    Đặt lại
                                </Button>
                            </Space>
                        }
                        variant="borderless"
                        styles={{ body: { padding: 0 } }}
                        style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}
                    >
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={invoices}
                            rowKey="orderId"
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total) => `Tổng cộng ${total} hóa đơn`
                            }}
                            size="middle"
                            rowClassName={() => 'invoice-row'}
                            bordered={false}
                            loading={loading}
                            onRow={(record) => ({
                                onClick: () => handleRowClick(record),
                                style: { cursor: 'pointer' },
                            })}
                            footer={() => (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text>Số lượng hóa đơn: {invoices.length}</Text>
                                    <Text strong>
                                        Tổng doanh thu: {invoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0).toLocaleString('vi-VN')} ₫
                                    </Text>
                                </div>
                            )}
                        />
                    </Card>
                </Content>
            </Layout>

            {/* Invoice Detail Modal */}
            <InvoiceDetailComponent
                visible={detailVisible}
                invoice={selectedInvoice}
                onClose={handleDetailClose}
                onUpdate={handleUpdateInvoice}
            />
        </Layout>
    );
};

export default InvoiceManagementPage;
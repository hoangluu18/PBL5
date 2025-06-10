import { useEffect, useState, useRef } from 'react';
import {
    Modal,
    Card,
    Row,
    Col,
    Typography,
    Table,
    Button,
    Tabs,
    Form,
    Input,
    DatePicker,
    Select,
    message
} from 'antd';
import {
    EditOutlined,
    ArrowLeftOutlined,
    CheckCircleOutlined,
    DownloadOutlined,
    SaveOutlined,
    CloseOutlined
} from '@ant-design/icons';
import { ExportPdfOrderDto, OrderDetailDto } from '../../../models/OrderDto';
import OrderService from '../../../services/order.service';
import dayjs from 'dayjs';
import { ColumnsType } from 'antd/es/table';
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface ProductItem {
    productId: string | number;
    productName: string;
    quantity: number;
    productPrice: number;
    discount: number;
    productAfterDiscount: number;
    totalPrice: number;
}

interface InvoiceDetailProps {
    visible: boolean;
    invoice?: {
        invoiceId?: string;
        date?: string;
        orderStatus?: string;
        orderTime?: string;
        paymentMethod?: string;
        orderId?: string;
        customerName?: string;
        totalAmount?: number;
    };

    onClose: () => void;
    // Add onUpdate callback to handle updates
    onUpdate?: (updatedData: any) => void;
}

const InvoiceDetailComponent: React.FC<InvoiceDetailProps> = ({
    visible,
    invoice,
    onClose,
    onUpdate
}) => {
    // State for managing display mode
    const [activeTab, setActiveTab] = useState('info');
    const [orderDetail, setOrderDetail] = useState<OrderDetailDto>();
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    // Ref for the content to be exported
    const invoiceRef = useRef<HTMLDivElement>(null);
    // Thêm state cho invoiceDetails
    const [invoiceDetails, setInvoiceDetails] = useState<any>({
        id: 'N/A',
        status: 'N/A',
        date: 'N/A',
        paymentMethod: 'N/A',
        deliveryDate: 'N/A',
        deliveryPerson: 'N/A',
        customer: {
            name: 'N/A',
            phone: 'N/A',
            address: 'N/A',
        },
        items: [],
        summary: {
            totalQuantity: 0,
            subtotal: 0,
            discount: 0,
            shippingFee: 0,
            total: 'Chưa thanh toán',
        },
        note: '',
    });

    useEffect(() => {
        if (invoice) {
            fetchOrderDetail();
        }
    }, [invoice]);
    // Thêm useEffect để cập nhật invoiceDetails khi orderDetail hoặc invoice thay đổi
    useEffect(() => {
        // Cập nhật lại invoiceDetails mỗi khi orderDetail hoặc invoice thay đổi
        setInvoiceDetails({
            id: invoice?.orderId || 'N/A',
            status: invoice?.orderStatus || 'N/A',
            date: invoice?.orderTime || 'N/A',
            paymentMethod: invoice?.paymentMethod || 'N/A',
            deliveryDate: orderDetail?.deliveryDate || 'N/A',
            deliveryPerson: 'Lưu Việt Hoàng',
            customer: {
                name: invoice?.customerName || 'N/A',
                phone: orderDetail?.phoneNumber || 'N/A',
                address: orderDetail?.address || 'N/A',
            },
            items: orderDetail?.orderProducts || [],
            summary: {
                totalQuantity: orderDetail?.orderProducts?.reduce((sum, item) => sum + item.quantity, 0) || 0,
                subtotal: orderDetail?.orderProducts?.reduce((sum, item) => sum + item.totalPrice, 0) || 0,
                discount: 0,
                shippingFee: orderDetail?.shippingFee || 0,
                total: invoice?.orderStatus === 'DELIVERED' ? invoice?.totalAmount : 'Chưa thanh toán',
            },
            note: orderDetail?.note || '',
        });
    }, [invoice, orderDetail]);
    // Set form values when editing starts or when order detail changes
    useEffect(() => {
        if (orderDetail && isEditing) {
            form.setFieldsValue({
                customerName: invoice?.customerName || '',
                phoneNumber: orderDetail?.phoneNumber || '',
                address: orderDetail?.address || '',
                deliveryDate: orderDetail?.deliveryDate ? dayjs(orderDetail.deliveryDate) : null,
                deliveryPerson: 'Lưu Việt Hoàng',
                paymentMethod: invoice?.paymentMethod || '',
                orderStatus: invoice?.orderStatus || '',
                note: orderDetail?.note || ''
            });
        }
    }, [orderDetail, isEditing, form, invoice]);

    const fetchOrderDetail = async () => {
        if (invoice?.orderId) {
            try {
                const orderService = new OrderService();
                const orderDetailData = await orderService.getOrderDetail(Number(invoice?.orderId));
                setOrderDetail(orderDetailData);
            } catch (error) {
                console.error('Error fetching order detail:', error);
                setOrderDetail({
                    deliveryDate: 'N/A',
                    phoneNumber: 'N/A',
                    address: 'N/A',
                    orderProducts: [],
                    shippingFee: 0,
                    note: '',
                }); // Default values if error occurs
            }
        }
    };
    const handleClose = () => {
        // Reset trạng thái edit
        setIsEditing(false);
        // Reset form
        form.resetFields();
        // Gọi hàm onClose được truyền từ prop
        onClose();
    };
    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        form.resetFields();
    };
    const handleSave = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            if (!invoice?.orderId) {
                throw new Error('Order ID is required');
            }

            const updatedData = {
                orderId: invoice.orderId,
                paymentMethod: values.paymentMethod,
                orderStatus: values.orderStatus,
                deliveryDate: values.deliveryDate ? values.deliveryDate.format('YYYY-MM-DD HH:mm:ss') : null,
                customerName: invoice?.customerName,
                phoneNumber: orderDetail?.phoneNumber,
                address: orderDetail?.address,
                deliveryPerson: 'Lưu Việt Hoàng',
                note: orderDetail?.note
            };

            // Call the update service
            const orderService = new OrderService();
            await orderService.updateOrder(updatedData);

            // Cập nhật ngay lập tức các trường có thể thấy được
            if (invoice && onUpdate) {
                const updatedInvoice = {
                    ...invoice,
                    orderStatus: values.orderStatus,
                    paymentMethod: values.paymentMethod
                };
                onUpdate(updatedInvoice);
            }

            // Cập nhật orderDetail và invoiceDetails một cách rõ ràng
            setOrderDetail((prev: any) => {
                const updated = {
                    ...prev,
                    deliveryDate: values.deliveryDate ? values.deliveryDate.format('YYYY-MM-DD HH:mm:ss') : null,
                };
                return updated;
            });

            // Force re-fetch dữ liệu từ server
            await fetchOrderDetail();

            message.success('Cập nhật đơn hàng thành công');
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update order:', error);
            message.error('Cập nhật đơn hàng thất bại');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return Math.floor(price).toLocaleString('vi-VN') + 'đ';
    };

    // Thêm hàm handleConfirmReturn vào component InvoiceDetailComponent
    const handleConfirmReturn = async () => {
        try {
            setLoading(true);

            if (!invoice?.orderId) {
                throw new Error('Order ID is required');
            }

            const updatedData = {
                orderId: invoice.orderId,
                orderStatus: 'RETURNED',  // Cập nhật trạng thái thành RETURNED
                paymentMethod: invoice?.paymentMethod, // Giữ nguyên phương thức thanh toán
                deliveryDate: orderDetail?.deliveryDate,
                customerName: invoice?.customerName,
                phoneNumber: orderDetail?.phoneNumber,
                address: orderDetail?.address,
                deliveryPerson: 'Lưu Việt Hoàng',
                note: orderDetail?.note
            };

            // Gọi service để cập nhật trạng thái
            const orderService = new OrderService();
            await orderService.updateOrder(updatedData);

            // Cập nhật UI ngay lập tức
            if (invoice && onUpdate) {
                const updatedInvoice = {
                    ...invoice,
                    orderStatus: 'RETURNED'
                };
                onUpdate(updatedInvoice);
            }

            // Cập nhật dữ liệu local
            setInvoiceDetails((prev: any) => ({
                ...prev,
                status: 'RETURNED'
            }));

            // Force re-fetch dữ liệu từ server
            await fetchOrderDetail();

            message.success('Đã xác nhận hoàn hàng thành công');
        } catch (error) {
            console.error('Failed to confirm return:', error);
            message.error('Xác nhận hoàn hàng thất bại');
        } finally {
            setLoading(false);
        }
    };

    const exportToPDF = async () => {
        try {
            // Tạo đối tượng dữ liệu theo cấu trúc backend
            const exportData: ExportPdfOrderDto = {
                orderId: Number(invoiceDetails.id) || 0,
                customerName: invoiceDetails.customer.name,
                phoneNumber: invoiceDetails.customer.phone,
                address: invoiceDetails.customer.address,
                orderTime: invoiceDetails.date,
                deliveryDate: invoiceDetails.deliveryDate,
                orderStatus: invoiceDetails.status,
                paymentMethod: invoiceDetails.paymentMethod,
                note: invoiceDetails.note,
                orderProducts: invoiceDetails.items,
                shippingFee: invoiceDetails.summary.shippingFee,
                subtotal: invoiceDetails.summary.subtotal,
                totalQuantity: invoiceDetails.summary.totalQuantity,
                total: typeof invoiceDetails.summary.total === 'number'
                    ? invoiceDetails.summary.total
                    : 0
            };

            // Gọi service để lấy PDF
            const orderService = new OrderService();
            const pdfBlob = await orderService.exportPdf(exportData);
            // Create download link and trigger download
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${invoiceDetails.id}.pdf`);
            document.body.appendChild(link);
            link.click();

            // Clean up để tránh memory leak
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
            }, 100);
            message.success('Xuất PDF thành công');
        } catch (error) {
            console.error('Failed to export PDF:', error);
            message.error('Xuất PDF thất bại');
        }
    };
    // Columns for the products table
    const columns: ColumnsType<ProductItem> = [
        {
            title: 'Mã hàng',
            dataIndex: 'productId',
            key: 'productId',
        },
        {
            title: 'Tên hàng',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
        },
        {
            title: 'Đơn giá',
            dataIndex: 'productPrice',
            key: 'productPrice',
            align: 'right',
            render: (price: number) => formatPrice(price),
        },
        {
            title: 'Giảm giá',
            dataIndex: 'discount',
            key: 'discount',
            align: 'right',
            render: (price: number) => formatPrice(price),
        },
        {
            title: 'Giá bán',
            dataIndex: 'productAfterDiscount',
            key: 'productAfterDiscount',
            align: 'right',
            render: (price: number) => formatPrice(price),
        },
        {
            title: 'Thành tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            align: 'right',
            render: (total: number) => formatPrice(total),
        },
    ];

    const InfoSection = () => {
        if (isEditing) {
            return (
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        customerName: invoice?.customerName || '',
                        phoneNumber: orderDetail?.phoneNumber || '',
                        address: orderDetail?.address || '',
                        deliveryDate: orderDetail?.deliveryDate ? dayjs(orderDetail.deliveryDate) : null,
                        deliveryPerson: 'Lưu Việt Hoàng',
                        paymentMethod: invoice?.paymentMethod || '',
                        orderStatus: invoice?.orderStatus || '',
                        note: orderDetail?.note || ''
                    }}
                >
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Form.Item label="Mã hóa đơn">
                                <Input value={invoiceDetails.id} disabled />
                            </Form.Item>
                            <Form.Item label="Ngày đặt">
                                <Input
                                    value={
                                        invoiceDetails.date && dayjs(invoiceDetails.date).isValid()
                                            ? dayjs(invoiceDetails.date).format('DD/MM/YYYY HH:mm:ss')
                                            : 'N/A'
                                    }
                                    disabled
                                />
                            </Form.Item>
                            <Form.Item
                                label="Tên khách hàng"
                                name="customerName"
                            >
                                <Input disabled />
                            </Form.Item>
                            <Form.Item
                                label="Số điện thoại"
                                name="phoneNumber"
                            >
                                <Input disabled />
                            </Form.Item>
                            <Form.Item
                                label="Địa chỉ"
                                name="address"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Trạng thái"
                                name="orderStatus"
                                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                            >
                                <Select>
                                    <Option value="PENDING">PENDING</Option>
                                    <Option value="PROCCESSING">PROCESSING</Option>
                                    <Option value="SHIPPED">SHIPPED</Option>
                                    <Option value="DELIVERED">DELIVERED</Option>
                                    <Option value="CANCELLED">CANCELLED</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Phương thức thanh toán"
                                name="paymentMethod"
                                rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
                            >
                                <Select>
                                    <Option value="COD">Thanh toán khi nhận hàng (COD)</Option>
                                    <Option value="BANK_TRANSFER">Chuyển khoản ngân hàng</Option>
                                    <Option value="CREDIT_CARD">Thẻ tín dụng</Option>
                                    <Option value="PAYPAL">PAYPAL</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Ngày nhận"
                                name="deliveryDate"
                            >
                                <DatePicker showTime format="DD/MM/YYYY HH:mm:ss" style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item
                                label="Người giao hàng"
                                name="deliveryPerson"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Ghi chú"
                        name="note"
                    >
                        <TextArea rows={4} disabled />
                    </Form.Item>

                    <Table
                        dataSource={invoiceDetails.items}
                        columns={columns}
                        pagination={false}
                        size="small"
                        bordered
                        style={{ marginTop: 16 }}
                        summary={() => (
                            <Table.Summary>
                                <Table.Summary.Row key='quantity'>
                                    <Table.Summary.Cell key='quantity-label' index={0} colSpan={6} align="right">
                                        <Text strong>Tổng số lượng:</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell key='quantity-value' index={1} align="right">
                                        <Text strong>{invoiceDetails.summary.totalQuantity}</Text>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                                <Table.Summary.Row key='subtotal'>
                                    <Table.Summary.Cell key='subtotal-label' index={0} colSpan={6} align="right">
                                        <Text strong>Tổng tiền hàng:</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell key='subtotal-value' index={1} align="right">
                                        <Text strong>{formatPrice(invoiceDetails.summary.subtotal)}</Text>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                                <Table.Summary.Row key='discount'>
                                    <Table.Summary.Cell key='discount-label' index={0} colSpan={6} align="right">
                                        <Text strong>Giảm giá hóa đơn:</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell key='discount-value' index={1} align="right">
                                        <Text strong>{invoiceDetails.summary.discount}</Text>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                                <Table.Summary.Row key='shippingFee'>
                                    <Table.Summary.Cell key='shipping-label' index={0} colSpan={6} align="right">
                                        <Text strong>Phí vận chuyển:</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell key='shipping-value' index={1} align="right">
                                        <Text strong>{formatPrice(invoiceDetails.summary.shippingFee)}</Text>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                                <Table.Summary.Row key='total'>
                                    <Table.Summary.Cell key='total-label' index={0} colSpan={6} align="right">
                                        <Text strong>Khách đã trả:</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell key='total-value' index={1} align="right">
                                        <Text strong type="danger">{(typeof invoiceDetails.summary.total === 'number'
                                            ? formatPrice(invoiceDetails.summary.total)
                                            : formatPrice(invoiceDetails.summary.total))}</Text>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            </Table.Summary>
                        )}
                    />
                </Form>
            );
        }

        return (
            <div ref={invoiceRef}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary">Mã hóa đơn:</Text>
                            <Text strong style={{ marginLeft: 8 }}>{invoiceDetails.id}</Text>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary">Ngày đặt:</Text>
                            <Text style={{ marginLeft: 8 }}>{invoiceDetails.date && dayjs(invoiceDetails.date).isValid()
                                ? dayjs(invoiceDetails.date).format('DD/MM/YYYY HH:mm:ss')
                                : 'N/A'}</Text>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary">Tên khách hàng:</Text>
                            <Text style={{ marginLeft: 8 }}>{invoiceDetails.customer.name}</Text>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary">Số điện thoại:</Text>
                            <Text style={{ marginLeft: 8 }}>{invoiceDetails.customer.phone}</Text>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary">Địa chỉ:</Text>
                            <Text style={{ marginLeft: 8 }}>{invoiceDetails.customer.address}</Text>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary">Trạng thái:</Text>
                            <Text style={{ marginLeft: 8 }}>{invoiceDetails.status}</Text>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary">Phương thức thanh toán:</Text>
                            <Text style={{ marginLeft: 8 }}>{invoiceDetails.paymentMethod}</Text>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary">Ngày nhận:</Text>
                            <Text style={{ marginLeft: 8 }}>{invoiceDetails.deliveryDate && dayjs(invoiceDetails.deliveryDate).isValid()
                                ? dayjs(invoiceDetails.deliveryDate).format('DD/MM/YYYY HH:mm:ss')
                                : 'N/A'}</Text>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary">Người giao hàng:</Text>
                            <Text style={{ marginLeft: 8 }}>{invoiceDetails.deliveryPerson}</Text>
                        </div>
                    </Col>
                </Row>

                <div style={{ marginTop: 16 }}>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Ghi chú:</Text>
                    <div style={{ marginBottom: 16, padding: '8px 12px', background: '#f5f5f5', borderRadius: '4px' }}>
                        {invoiceDetails.note || 'Không có ghi chú'}
                    </div>
                </div>

                <Table
                    key={invoiceDetails.id}
                    dataSource={invoiceDetails.items}
                    columns={columns}
                    pagination={false}
                    size="small"
                    bordered
                    style={{ marginTop: 16 }}
                    summary={() => (
                        <Table.Summary>
                            <Table.Summary.Row key='quantity'>
                                <Table.Summary.Cell key='quantity-label' index={0} colSpan={6} align="right">
                                    <Text strong>Tổng số lượng:</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell key='quantity-value' index={1} align="right">
                                    <Text strong>{invoiceDetails.summary.totalQuantity}</Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row key='subtotal'>
                                <Table.Summary.Cell key='subtotal-label' index={0} colSpan={6} align="right">
                                    <Text strong>Tổng tiền hàng:</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell key='subtotal-value' index={0} align="right">
                                    <Text strong>{formatPrice(invoiceDetails.summary.subtotal)}</Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row key='discount'>
                                <Table.Summary.Cell key='discount-label' index={0} colSpan={6} align="right">
                                    <Text strong>Giảm giá hóa đơn:</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell key='discount-value' index={0} align="right">
                                    <Text strong>{invoiceDetails.summary.discount}</Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row key='shippingFee'>
                                <Table.Summary.Cell key='shipping-label' index={0} colSpan={6} align="right">
                                    <Text strong>Phí vận chuyển:</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell key='shipping-value' index={0} align="right">
                                    <Text strong>{formatPrice(invoiceDetails.summary.shippingFee)}</Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row key='total'>
                                <Table.Summary.Cell key='total-label' index={0} colSpan={6} align="right">
                                    <Text strong>Khách đã trả:</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell key='total-value' index={1} align="right">
                                    <Text strong type="danger">{(typeof invoiceDetails.summary.total === 'number'
                                        ? formatPrice(invoiceDetails.summary.total)
                                        : invoiceDetails.summary.total)}</Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            </div>
        );
    };

    const PaymentHistorySection = () => (
        <div>
            <Table
                dataSource={[
                    {
                        key: '1',
                        date: '03/03/2025 20:54',
                        amount: invoice?.totalAmount,
                        method: invoice?.paymentMethod,
                        status: invoice?.orderStatus,
                        note: ''
                    }
                ]}
                columns={[
                    {
                        title: 'Ngày thanh toán',
                        dataIndex: 'date',
                        key: 'date',
                    },
                    {
                        title: 'Số tiền',
                        dataIndex: 'amount',
                        key: 'amount',
                        align: 'right',
                        render: (amount) => formatPrice(amount),
                    },
                    {
                        title: 'Phương thức',
                        dataIndex: 'method',
                        key: 'method',
                    },
                    {
                        title: 'Trạng thái',
                        dataIndex: 'status',
                        key: 'status',
                        render: (text) => (
                            <Text type="success">
                                <CheckCircleOutlined style={{ marginRight: 8 }} />
                                {text}
                            </Text>
                        )
                    },
                    {
                        title: 'Ghi chú',
                        dataIndex: 'note',
                        key: 'note',
                    },
                ]}
                pagination={false}
                size="small"
                bordered
            />
        </div>
    );

    const buttonStyle = {
        marginRight: 8
    };

    return (
        <Modal
            open={visible}
            onCancel={handleClose}
            width={1000}
            footer={null}
            styles={{ body: { padding: 0 } }}
        >
            <Card variant='borderless'>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            type="text"
                            onClick={handleClose}
                            style={{ marginRight: 16 }}
                        />
                        <Title level={4} style={{ margin: 0 }}>
                            {invoiceDetails.id} - {invoiceDetails.customer.name}
                        </Title>
                    </div>
                    <div>
                        {isEditing ? (
                            <>
                                <Button
                                    icon={<CloseOutlined />}
                                    style={buttonStyle}
                                    onClick={handleCancel}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    icon={<SaveOutlined />}
                                    style={buttonStyle}
                                    type="primary"
                                    onClick={handleSave}
                                    loading={loading}
                                >
                                    Lưu
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    icon={<EditOutlined />}
                                    style={buttonStyle}
                                    onClick={handleEdit}
                                >
                                    Cập nhật
                                </Button>
                                <Button
                                    icon={<DownloadOutlined />}
                                    style={buttonStyle}
                                    onClick={exportToPDF}
                                >
                                    Xuất PDF
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    type="card"
                    items={[
                        {
                            key: "info",
                            label: "Thông tin",
                            children: <InfoSection />
                        },
                        {
                            key: "payment-history",
                            label: "Lịch sử thanh toán",
                            children: invoice?.orderStatus === 'DELIVERED'
                                ? <PaymentHistorySection />
                                : <div>Bạn chưa thanh toán</div>
                        }
                    ]}
                />

                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button danger style={buttonStyle} onClick={handleClose}>
                        Đóng
                    </Button>
                    {invoice?.orderStatus === 'RETURN_REQUESTED' && !isEditing && (
                        <Button style={buttonStyle} type="primary" loading={loading} onClick={handleConfirmReturn}>
                            Xác nhận hoàn hàng
                        </Button>
                    )}
                </div>
            </Card>
        </Modal>
    );
};

export default InvoiceDetailComponent;
import { useState, useEffect, useContext } from 'react';
import {
    Form,
    Input,
    Button,
    Card,
    Typography,
    Space,
    message,
    Row,
    Col,
    Divider,
    Steps,
    Result,
    Select,
    Tabs,
    Tag,
    Timeline,
    Alert,
    Spin
} from 'antd';
import {
    ShopOutlined,
    UserOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    SendOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    CloseCircleOutlined,
    ReloadOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { AuthContext } from '../components/context/auth.context';
import StoreRequestService from '../services/store_request_service';
import { Link } from 'react-router-dom';
import { StoreRequestDtoImpl } from '../models/dto/StoreRequestDto';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Step } = Steps;
const { Option } = Select;
const { TabPane } = Tabs;



export default function SellerRegistrationForm() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [activeTab, setActiveTab] = useState('1');

    // State cho status request
    const [requestStatus, setRequestStatus] = useState<StoreRequestDtoImpl | null>(null);
    const [statusLoading, setStatusLoading] = useState(false);
    const [hasExistingRequest, setHasExistingRequest] = useState(false);

    // State cho địa chỉ
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<{ code: string, name: string } | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<{ code: string, name: string } | null>(null);
    const [selectedWard, setSelectedWard] = useState<{ code: string, name: string } | null>(null);
    const { customer } = useContext(AuthContext);

    // Load provinces và check existing request khi component mount
    useEffect(() => {
        fetchProvinces();
        checkExistingRequest();
    }, [customer.id]);

    const checkExistingRequest = async () => {
        if (!customer.id) return;

        setStatusLoading(true);
        try {
            const storeRequestService = new StoreRequestService();
            const response = await storeRequestService.getByCustomerId(customer.id);

            if (response) {
                setRequestStatus(response);
                setHasExistingRequest(true);
                setActiveTab('2'); // Chuyển sang tab kết quả nếu đã có request
            }
        } catch (error) {
            // Không có request nào hoặc lỗi khác
            console.log('No existing request found or error:', error);
        } finally {
            setStatusLoading(false);
        }
    };

    const refreshStatus = () => {
        checkExistingRequest();
    };

    const fetchProvinces = async () => {
        try {
            const response = await fetch('https://provinces.open-api.vn/api/p/');
            const data = await response.json();
            setProvinces(data);
        } catch (error) {
            console.error('Error fetching provinces:', error);
            message.error('Không thể tải danh sách tỉnh thành');
        }
    };

    const fetchDistricts = async (provinceCode: any) => {
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
            const data = await response.json();
            setDistricts(data.districts || []);
            setWards([]);
        } catch (error) {
            console.error('Error fetching districts:', error);
            message.error('Không thể tải danh sách quận huyện');
        }
    };

    const fetchWards = async (districtCode: any) => {
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
            const data = await response.json();
            setWards(data.wards || []);
        } catch (error) {
            console.error('Error fetching wards:', error);
            message.error('Không thể tải danh sách phường xã');
        }
    };

    const handleProvinceChange = (value: any, option: any) => {
        setSelectedProvince({ code: value, name: option.children });
        setSelectedDistrict(null);
        setSelectedWard(null);
        setDistricts([]);
        setWards([]);

        form.setFieldsValue({
            district: undefined,
            ward: undefined
        });

        fetchDistricts(value);
    };

    const handleDistrictChange = (value: any, option: any) => {
        setSelectedDistrict({ code: value, name: option.children });
        setSelectedWard(null);
        setWards([]);

        form.setFieldsValue({
            ward: undefined
        });

        fetchWards(value);
    };

    const handleWardChange = (value: any, option: any) => {
        setSelectedWard({ code: value, name: option.children });
    };

    const onFinish = async (values: any) => {
        setLoading(true);

        try {
            const fullAddress = `${values.street || ''}, ${selectedWard?.name || ''}, ${selectedDistrict?.name || ''}, ${selectedProvince?.name || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, '');

            const formData = {
                customerId: customer.id,
                storeName: values.store_name,
                description: values.description,
                phoneNumber: values.phone_number,
                address: fullAddress
            };

            const storeRequestService = new StoreRequestService();
            await storeRequestService.save(formData);

            message.success('Đăng ký thành công! Chúng tôi sẽ xem xét và phản hồi trong vòng 24-48 giờ.');
            setSubmitted(true);
            setHasExistingRequest(true);

            // Refresh status và chuyển tab
            await checkExistingRequest();
            setActiveTab('2');

        } catch (error) {
            message.error('Có lỗi xảy ra khi gửi đăng ký. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        message.error('Vui lòng kiểm tra và điền đầy đủ thông tin bắt buộc!');
        console.log('Failed:', errorInfo);
    };

    const validatePhone = (_: any, value: any) => {
        if (!value) {
            return Promise.resolve();
        }
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(value)) {
            return Promise.reject(new Error('Số điện thoại không hợp lệ (10-11 số)!'));
        }
        return Promise.resolve();
    };

    const handleFormChange = () => {
        const fields = form.getFieldsValue();
        const requiredFields = ['store_name', 'description', 'phone_number', 'province', 'district', 'ward'];
        const completedFields = requiredFields.filter(field => fields[field]);

        if (completedFields.length <= 2) {
            setCurrentStep(0);
        } else if (completedFields.length <= 4) {
            setCurrentStep(1);
        } else {
            setCurrentStep(2);
        }
    };

    const getStatusIcon = (status: number) => {
        switch (status) {
            case 0:
                return <ClockCircleOutlined style={{ color: '#faad14' }} />;
            case 1:
                return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
            case 2:
                return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
            default:
                return <ExclamationCircleOutlined />;
        }
    };

    const getStatusColor = (status: number) => {
        switch (status) {
            case 0:
                return 'orange';
            case 1:
                return 'green';
            case 2:
                return 'red';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: number) => {
        switch (status) {
            case 0:
                return 'Đang chờ xét duyệt';
            case 1:
                return 'Đã được phê duyệt';
            case 2:
                return 'Bị từ chối';
            default:
                return 'Không xác định';
        }
    };

    const renderTimelineItems = () => {
        if (!requestStatus) return [];

        const items = [
            {
                color: 'green',
                dot: <CheckCircleOutlined />,
                children: (
                    <div>
                        <Text strong>Đăng ký thành công</Text>
                        <br />
                        <Text type="secondary">
                            {new Date(requestStatus.requestDate).toLocaleString('vi-VN')}
                        </Text>
                    </div>
                )
            }
        ];

        if (requestStatus.status === 0) { // PENDING
            items.push({
                color: 'blue',
                dot: <ClockCircleOutlined />,
                children: (
                    <div>
                        <Text strong>Đang xem xét hồ sơ</Text>
                        <br />
                        <Text type="secondary">Vui lòng chờ phản hồi</Text>
                    </div>
                )
            });
        } else if (requestStatus.status === 1) { // APPROVED
            items.push({
                color: 'green',
                dot: <CheckCircleOutlined />,
                children: (
                    <div>
                        <Text strong>Đã được phê duyệt</Text>
                        <br />
                        <Text type="secondary">
                            {new Date(requestStatus.responseDate).toLocaleString('vi-VN')}
                        </Text>
                    </div>
                )
            });
        } else if (requestStatus.status === 2) { // REJECTED
            items.push({
                color: 'red',
                dot: <CloseCircleOutlined />,
                children: (
                    <div>
                        <Text strong>Bị từ chối</Text>
                        <br />
                        <Text type="secondary">
                            {new Date(requestStatus.responseDate).toLocaleString('vi-VN')}
                        </Text>
                        {requestStatus.responseNote && (
                            <>
                                <br />
                                <Text type="danger">Lý do: {requestStatus.responseNote}</Text>
                            </>
                        )}
                    </div>
                )
            });
        }

        return items;
    };

    // Registration Form Component
    const renderRegistrationForm = () => (
        <Card style={{
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
            <Form
                form={form}
                name="seller_registration"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                onValuesChange={handleFormChange}
                requiredMark={false}
                style={{ padding: '20px' }}
            >
                <Row gutter={[24, 16]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label={<Text strong>Tên cửa hàng</Text>}
                            name="store_name"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên cửa hàng!' },
                                { min: 3, message: 'Tên cửa hàng phải có ít nhất 3 ký tự!' },
                                { max: 255, message: 'Tên cửa hàng không được quá 255 ký tự!' }
                            ]}
                        >
                            <Input
                                prefix={<ShopOutlined />}
                                placeholder="Nhập tên cửa hàng của bạn"
                                size="large"
                                style={{ borderRadius: '8px' }}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label={<Text strong>Số điện thoại</Text>}
                            name="phone_number"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                { validator: validatePhone }
                            ]}
                        >
                            <Input
                                prefix={<PhoneOutlined />}
                                placeholder="Nhập số điện thoại liên hệ"
                                size="large"
                                style={{ borderRadius: '8px' }}
                            />
                        </Form.Item>
                    </Col>

                    {/* Địa chỉ cửa hàng */}
                    <Col xs={24}>
                        <Text strong style={{ fontSize: '16px', marginBottom: '16px', display: 'block' }}>
                            <EnvironmentOutlined style={{ marginRight: '8px' }} />
                            Địa chỉ cửa hàng
                        </Text>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item
                            label={<Text strong>Tỉnh/Thành phố</Text>}
                            name="province"
                            rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
                        >
                            <Select
                                placeholder="Chọn tỉnh/thành phố"
                                size="large"
                                style={{ borderRadius: '8px' }}
                                showSearch
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={handleProvinceChange}
                            >
                                {provinces.map(province => (
                                    <Option key={province.code} value={province.code}>
                                        {province.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item
                            label={<Text strong>Quận/Huyện</Text>}
                            name="district"
                            rules={[{ required: true, message: 'Vui lòng chọn quận/huyện!' }]}
                        >
                            <Select
                                placeholder="Chọn quận/huyện"
                                size="large"
                                style={{ borderRadius: '8px' }}
                                showSearch
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={handleDistrictChange}
                                disabled={!selectedProvince}
                            >
                                {districts.map(district => (
                                    <Option key={district.code} value={district.code}>
                                        {district.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item
                            label={<Text strong>Phường/Xã</Text>}
                            name="ward"
                            rules={[{ required: true, message: 'Vui lòng chọn phường/xã!' }]}
                        >
                            <Select
                                placeholder="Chọn phường/xã"
                                size="large"
                                style={{ borderRadius: '8px' }}
                                showSearch
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={handleWardChange}
                                disabled={!selectedDistrict}
                            >
                                {wards.map(ward => (
                                    <Option key={ward.code} value={ward.code}>
                                        {ward.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            label={<Text strong>Số nhà, tên đường</Text>}
                            name="street"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số nhà, tên đường!' },
                                { min: 5, message: 'Địa chỉ phải có ít nhất 5 ký tự!' }
                            ]}
                        >
                            <Input
                                placeholder="Ví dụ: 123 Nguyễn Văn A"
                                size="large"
                                style={{ borderRadius: '8px' }}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            label={<Text strong>Mô tả cửa hàng</Text>}
                            name="description"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mô tả cửa hàng!' },
                                { min: 20, message: 'Mô tả phải có ít nhất 20 ký tự!' },
                                { max: 1000, message: 'Mô tả không được quá 1000 ký tự!' }
                            ]}
                        >
                            <TextArea
                                placeholder="Mô tả về cửa hàng của bạn: loại sản phẩm kinh doanh, kinh nghiệm, điểm mạnh..."
                                rows={4}
                                size="large"
                                style={{ borderRadius: '8px' }}
                                showCount
                                maxLength={1000}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider />

                <div style={{ textAlign: 'center' }}>
                    <Space direction="vertical" size="middle">
                        <Text type="secondary">
                            Bằng cách đăng ký, bạn đồng ý với các điều khoản và chính sách của chúng tôi
                        </Text>

                        <Space size="middle">
                            <Button
                                size="large"
                                style={{ borderRadius: '8px', minWidth: '120px' }}
                            >
                                Hủy
                            </Button>

                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                size="large"
                                icon={<SendOutlined />}
                                style={{
                                    borderRadius: '8px',
                                    minWidth: '160px',
                                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                    border: 'none'
                                }}
                            >
                                {loading ? 'Đang gửi...' : 'Gửi đăng ký'}
                            </Button>
                        </Space>
                    </Space>
                </div>
            </Form>
        </Card>
    );

    // Status Result Component
    const renderStatusResult = () => {
        if (statusLoading) {
            return (
                <Card style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Spin size="large" />
                    <br />
                    <Text>Đang tải thông tin...</Text>
                </Card>
            );
        }

        if (!requestStatus) {
            return (
                <Card style={{ textAlign: 'center' }}>
                    <Result
                        icon={<ExclamationCircleOutlined />}
                        title="Chưa có đăng ký nào"
                        subTitle="Bạn chưa có đăng ký trở thành người bán nào. Hãy chuyển sang tab đăng ký để bắt đầu!"
                        extra={
                            <Button
                                type="primary"
                                onClick={() => setActiveTab('1')}
                                icon={<SendOutlined />}
                            >
                                Đăng ký ngay
                            </Button>
                        }
                    />
                </Card>
            );
        }

        return (
            <div>
                {/* Status Overview */}
                <Card style={{ marginBottom: 24, borderRadius: '16px' }}>
                    <Row gutter={[24, 24]} align="middle">
                        <Col xs={24} md={16}>
                            <Space direction="vertical" size="small">
                                <Title level={3} style={{ margin: 0 }}>
                                    {getStatusIcon(requestStatus.status)} Trạng thái đăng ký
                                </Title>
                                <Tag
                                    color={getStatusColor(requestStatus.status)}
                                    style={{ fontSize: '14px', padding: '4px 12px' }}
                                >
                                    {getStatusText(requestStatus.status)}
                                </Tag>
                                <Text type="secondary">
                                    Đăng ký ngày: {new Date(requestStatus.requestDate).toLocaleDateString('vi-VN')}
                                </Text>
                            </Space>
                        </Col>
                        <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={refreshStatus}
                                loading={statusLoading}
                            >
                                Làm mới
                            </Button>
                        </Col>
                    </Row>
                </Card>

                <Row gutter={[24, 24]}>
                    {/* Timeline */}
                    <Col xs={24} lg={12}>
                        <Card title="Tiến trình xử lý" style={{ borderRadius: '16px' }}>
                            <Timeline items={renderTimelineItems()} />
                        </Card>
                    </Col>

                    {/* Request Details */}
                    <Col xs={24} lg={12}>
                        <Card title="Thông tin đăng ký" style={{ borderRadius: '16px' }}>
                            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                <div>
                                    <Text strong>Tên cửa hàng:</Text>
                                    <br />
                                    <Text>{requestStatus.storeName}</Text>
                                </div>

                                <div>
                                    <Text strong>Số điện thoại:</Text>
                                    <br />
                                    <Text>{requestStatus.phoneNumber}</Text>
                                </div>

                                <div>
                                    <Text strong>Địa chỉ:</Text>
                                    <br />
                                    <Text>{requestStatus.address}</Text>
                                </div>

                                <div>
                                    <Text strong>Mô tả:</Text>
                                    <br />
                                    <Text>{requestStatus.description}</Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                {/* Alerts based on status */}
                {requestStatus.status === 0 && (
                    <Alert
                        message="Đang chờ xét duyệt"
                        description="Đăng ký của bạn đang được xem xét. Chúng tôi sẽ phản hồi qua email trong vòng 24-48 giờ."
                        type="info"
                        showIcon
                        style={{ marginTop: 24 }}
                    />
                )}

                {requestStatus.status === 1 && (
                    <Alert
                        message="Chúc mừng! Đăng ký đã được phê duyệt"
                        description={
                            <div>
                                <p>Cửa hàng của bạn đã được kích hoạt. Bạn có thể bắt đầu bán hàng ngay bây giờ!</p>
                                {requestStatus.responseNote && (
                                    <div dangerouslySetInnerHTML={{ __html: requestStatus.responseNote }} />
                                )}
                            </div>
                        }
                        type="success"
                        showIcon
                        style={{ marginTop: 24 }}
                        action={
                            <Button size="small" type="primary">
                                Vào trang quản lý cửa hàng
                            </Button>
                        }
                    />
                )}

                {requestStatus.status === 2 && (
                    <Alert
                        message="Đăng ký bị từ chối"
                        description={
                            <div>
                                <p>Rất tiếc, đăng ký của bạn không được phê duyệt.</p>
                                {requestStatus.status === 2 && (
                                    <p><strong>Lý do:</strong> <div dangerouslySetInnerHTML={{ __html: requestStatus.responseNote }} /></p>
                                )}
                                {requestStatus.status === 2 && (
                                    <p><strong>Ghi chú:</strong> <div dangerouslySetInnerHTML={{ __html: requestStatus.responseNote }} /></p>
                                )}
                                <p>Bạn có thể đăng ký lại sau khi khắc phục các vấn đề trên.</p>
                            </div>
                        }
                        type="error"
                        showIcon
                        style={{ marginTop: 24 }}
                        action={
                            <Button
                                size="small"
                                onClick={() => setActiveTab('1')}
                            >
                                Đăng ký lại
                            </Button>
                        }
                    />
                )}
            </div>
        );
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                {/* Header */}
                <Card style={{
                    marginBottom: 24,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    border: 'none',
                    color: 'white'
                }}>
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <ShopOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                        <Title level={1} style={{ color: 'white', margin: 0 }}>
                            Đăng Ký Trở Thành Người Bán
                        </Title>
                        <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', margin: '8px 0 0 0' }}>
                            Gia nhập nền tảng của chúng tôi và bắt đầu kinh doanh online ngay hôm nay
                        </Paragraph>
                    </div>
                </Card>

                {/* Progress Steps - chỉ hiển thị ở tab đăng ký */}
                {activeTab === '1' && (
                    <Card style={{ marginBottom: 24, borderRadius: '16px' }}>
                        <Steps current={currentStep} style={{ padding: '20px' }}>
                            <Step title="Thông tin cơ bản" icon={<ShopOutlined />} />
                            <Step title="Chi tiết cửa hàng" icon={<FileTextOutlined />} />
                            <Step title="Hoàn thành" icon={<CheckCircleOutlined />} />
                        </Steps>
                    </Card>
                )}

                {/* Main Content with Tabs */}
                <Card style={{ borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        size="large"
                        style={{ padding: '20px' }}
                    >
                        <TabPane
                            tab={
                                <span>
                                    <SendOutlined />
                                    Đăng ký mới
                                </span>
                            }
                            key="1"
                            disabled={hasExistingRequest && requestStatus?.status === 0}
                        >
                            {hasExistingRequest && requestStatus?.status === 0 ? (
                                <Alert
                                    message="Bạn đã có đăng ký đang chờ xét duyệt"
                                    description="Vui lòng chờ phản hồi trước khi đăng ký lại."
                                    type="warning"
                                    showIcon
                                    action={
                                        <Button onClick={() => setActiveTab('2')}>
                                            Xem trạng thái
                                        </Button>
                                    }
                                />
                            ) : (
                                renderRegistrationForm()
                            )}
                        </TabPane>

                        <TabPane
                            tab={
                                <span>
                                    <EyeOutlined />
                                    Kết quả đăng ký
                                </span>
                            }
                            key="2"
                        >
                            {renderStatusResult()}
                        </TabPane>
                    </Tabs>
                </Card>

                {/* Info Cards - chỉ hiển thị ở tab đăng ký */}
                {activeTab === '1' && (
                    <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                        <Col xs={24} md={8}>
                            <Card
                                size="small"
                                style={{ borderRadius: '12px', textAlign: 'center' }}
                                bodyStyle={{ padding: '20px' }}
                            >
                                <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
                                <Title level={5}>Xét duyệt nhanh</Title>
                                <Text type="secondary">Phản hồi trong 24-48h</Text>
                            </Card>
                        </Col>

                        <Col xs={24} md={8}>
                            <Card
                                size="small"
                                style={{ borderRadius: '12px', textAlign: 'center' }}
                                bodyStyle={{ padding: '20px' }}
                            >
                                <UserOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                                <Title level={5}>Hỗ trợ 24/7</Title>
                                <Text type="secondary">Đội ngũ hỗ trợ chuyên nghiệp</Text>
                            </Card>
                        </Col>

                        <Col xs={24} md={8}>
                            <Card
                                size="small"
                                style={{ borderRadius: '12px', textAlign: 'center' }}
                                bodyStyle={{ padding: '20px' }}
                            >
                                <ShopOutlined style={{ fontSize: '24px', color: '#722ed1', marginBottom: '8px' }} />
                                <Title level={5}>Miễn phí đăng ký</Title>
                                <Text type="secondary">Không mất phí ban đầu</Text>
                            </Card>
                        </Col>
                    </Row>
                )}
            </div>
        </div>
    );
}
import React, { useState, useEffect, useContext } from 'react';
import {
    Form,
    Input,
    Button,
    Upload,
    message,
    Card,
    Row,
    Col,
    Typography,
    Spin,
    Divider,
    Statistic,
    Select
} from 'antd';
import {
    UploadOutlined,
    EditOutlined,
    SaveOutlined,
    ShopOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    TeamOutlined,
    StarOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { ShopProfileService, ShopProfile } from '../../../src/services/shop/ShopProfileService.service';
import { AuthContext } from '../../../src/utils/auth.context';
import { VietnamGeoService } from '../../services/geographic_api/VietnamGeoService.service';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ShopProfilePage: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [shopProfile, setShopProfile] = useState<ShopProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [uploadLoading, setUploadLoading] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>('');
    //address state
    const [cities, setCities] = useState<string[]>([]);
    const [districts, setDistricts] = useState<string[]>([]);
    const [wards, setWards] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedWard, setSelectedWard] = useState<string>('');
    const [detailAddress, setDetailAddress] = useState<string>('');
    //service
    const shopProfileService = new ShopProfileService();
    const vietnamGeoService = new VietnamGeoService();

    const handleCityChange = (cityValue: string) => {
        console.log(`Đã chọn Tỉnh/TP: ${cityValue}`);
        setSelectedCity(cityValue);
        setSelectedDistrict('');
        setSelectedWard('');
        setDistricts([]);
        setWards([]);
        form.setFieldsValue({ district: undefined, ward: undefined });

        // Gọi API lấy danh sách quận/huyện của tỉnh/TP đã chọn
        vietnamGeoService.getDistrictsByCity(cityValue)
            .then(districtsList => {
                console.log("Danh sách quận/huyện:", districtsList);
                setDistricts(districtsList);
            })
            .catch(error => {
                console.error("Lỗi khi lấy quận/huyện:", error);
                message.error("Không thể lấy danh sách quận/huyện");
            });
    };

    const handleDistrictChange = (districtValue: string) => {
        console.log(`Đã chọn Quận/Huyện: ${districtValue} của ${selectedCity}`);
        setSelectedDistrict(districtValue);
        setSelectedWard('');
        setWards([]);
        form.setFieldsValue({ ward: undefined });

        // Gọi API lấy danh sách phường/xã của quận/huyện đã chọn
        vietnamGeoService.getWardsByDistrictAndCity(selectedCity, districtValue)
            .then(wardsList => {
                console.log("Danh sách phường/xã:", wardsList);
                setWards(wardsList);
            })
            .catch(error => {
                console.error("Lỗi khi lấy phường/xã:", error);
                message.error("Không thể lấy danh sách phường/xã");
            });
    };

    const handleWardChange = (wardValue: string) => {
        console.log(`Đã chọn Phường/Xã: ${wardValue}`);
        setSelectedWard(wardValue);
    };

    const handleDetailAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetailAddress(e.target.value);
    };

    useEffect(() => {
        fetchShopProfile();
        fetchCities();
    }, []);

    useEffect(() => {
        if (selectedCity && !form.getFieldValue('city')) {
            form.setFieldsValue({ city: selectedCity });
        }
    }, [selectedCity, form]);

    useEffect(() => {
        if (selectedDistrict && !form.getFieldValue('district')) {
            form.setFieldsValue({ district: selectedDistrict });
        }
    }, [selectedDistrict, form]);

    useEffect(() => {
        if (selectedWard && !form.getFieldValue('ward')) {
            form.setFieldsValue({ ward: selectedWard });
        }
    }, [selectedWard, form]);

    useEffect(() => {
        if (detailAddress && !form.getFieldValue('detailAddress')) {
            form.setFieldsValue({ detailAddress });
        }
    }, [detailAddress, form]);

    

    const fetchShopProfile = async () => {
        try {
            setLoading(true);
            const profile = await shopProfileService.getShopProfile(user.id);
            setShopProfile(profile);
            setImageUrl(profile.photo || '');

            if (profile.address) {
                parseAddress(profile.address);
            }

            form.setFieldsValue({
                name: profile.name,
                description: profile.description,
                address: profile.address,
                phone: profile.phone,
                city: profile.city
            });
        } catch (error) {
            message.error('Không thể tải thông tin cửa hàng');
            console.error('Error fetching shop profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (!shopProfile) return;

            // Tạo địa chỉ đầy đủ - giữ nguyên tên đầy đủ của các đơn vị hành chính
            const fullAddress = `${detailAddress}, ${selectedWard}, ${selectedDistrict}, ${selectedCity}`;

            const updatedProfile = {
                ...shopProfile,
                name: values.name,
                description: values.description,
                address: fullAddress,
                phone: values.phone,
                city: selectedCity
            };

            setLoading(true);
            const result = await shopProfileService.updateShopProfile(updatedProfile);
            setShopProfile(result);
            message.success('Thông tin cửa hàng đã được cập nhật');
            setEditMode(false);
        } catch (error) {
            message.error('Không thể cập nhật thông tin cửa hàng');
            console.error('Error updating shop profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload: UploadProps['onChange'] = async (info) => {
        if (info.file.status === 'uploading') {
            setUploadLoading(true);
            return;
        }

        if (info.file.status === 'done') {
            setUploadLoading(false);
            message.success('Ảnh đã được tải lên thành công');
        } else if (info.file.status === 'error') {
            setUploadLoading(false);
            message.error('Tải ảnh lên thất bại');
        }
    };

    const parseAddress = (address: string) => {
        console.log("Đang phân tích địa chỉ:", address);
        const parts = address.split(', ');
        console.log("Các phần của địa chỉ:", parts);

        if (parts.length >= 4) {
            // Địa chỉ chi tiết
            setDetailAddress(parts[0]);

            // Phường/xã - giữ nguyên tên đầy đủ
            setSelectedWard(parts[1]);
            console.log("Đã trích xuất phường/xã:", parts[1]);

            // Quận/huyện - giữ nguyên tên đầy đủ
            setSelectedDistrict(parts[2]);
            console.log("Đã trích xuất quận/huyện:", parts[2]);

            // Tỉnh/thành phố - giữ nguyên tên đầy đủ
            setSelectedCity(parts[3]);
            console.log("Đã trích xuất tỉnh/thành phố:", parts[3]);

            // Tải dữ liệu cho các dropdown
            fetchDistrictsByCity(parts[3]);
            fetchWardsByDistrictAndCity(parts[3], parts[2]);
        } else {
            console.log("Địa chỉ không đủ thông tin để phân tích");
        }
    };

    const fetchCities = async () => {
        const citiesList = await vietnamGeoService.getAllCities();
        setCities(citiesList);
    };

    const fetchDistrictsByCity = async (city: string) => {
        if (!city) return;
        setSelectedCity(city);
        const districtsList = await vietnamGeoService.getDistrictsByCity(city);
        setDistricts(districtsList);
        setSelectedDistrict('');
        setWards([]);
        setSelectedWard('');
    };

    const fetchWardsByDistrictAndCity = async (city: string, district: string) => {
        if (!city || !district) return;
        setSelectedDistrict(district);
        const wardsList = await vietnamGeoService.getWardsByDistrictAndCity(city, district);
        setWards(wardsList);
        setSelectedWard('');
    };

    const customUploadRequest = async (options: any) => {
        const { file, onSuccess, onError } = options;

        if (!shopProfile) {
            onError(new Error('Không tìm thấy thông tin cửa hàng'));
            return;
        }

        try {
            const url = await shopProfileService.uploadShopPhoto(file, shopProfile.id);
            setImageUrl(url);
            onSuccess({ url }, file);

            // Cập nhật shopProfile với URL ảnh mới
            setShopProfile(prev => prev ? { ...prev, photo: url } : null);
        } catch (error) {
            console.error('Error uploading shop photo:', error);
            onError(error);
        }
    };

    if (loading && !shopProfile) {
        return (
            <div style={{ width: '100%', textAlign: 'center', padding: '50px 0' }}>
                <Spin size="large" />
                <p>Đang tải thông tin cửa hàng...</p>
            </div>
        );
    }

    const uploadButtonStyle = `
  .shop-photo-uploader .ant-upload.ant-upload-select-picture-card {
    width: 220px !important;
    height: 220px !important;
    margin: 0 auto;
  }
`;

    return (
        <div className="shop-profile-container" style={{ padding: '24px' }}>
            <Card bordered={false}>
                <Title level={2}>
                    <ShopOutlined /> Hồ sơ cửa hàng
                    {!editMode ? (
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => setEditMode(true)}
                            style={{ float: 'right' }}
                        >
                            Chỉnh sửa
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSave}
                            style={{ float: 'right' }}
                        >
                            Lưu thay đổi
                        </Button>
                    )}
                </Title>
                <Divider />

                <Row gutter={[24, 24]}>
                    {/* Left column - Image and stats */}
                    <Col xs={24} md={8}>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            {!editMode ? (
                                <div className="shop-avatar" style={{ maxWidth: '220px', margin: '0 auto' }}>
                                    <img
                                        src={imageUrl || 'https://via.placeholder.com/200x200?text=Shop+Image'}
                                        alt="Shop"
                                        style={{
                                            width: '100%',
                                            maxWidth: '220px',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                            ) : (
                                <Upload
                                    name="shopPhoto"
                                    listType="picture-card"
                                    className="shop-photo-uploader"
                                    showUploadList={false}
                                    onChange={handlePhotoUpload}
                                    customRequest={customUploadRequest}
                                    style={{ width: '220px', height: '220px', margin: '0 auto' }}
                                >
                                    {imageUrl ? (
                                        <div style={{ overflow: 'hidden', borderRadius: '8px', width: '100%', height: '100%' }}>
                                            <img
                                                src={imageUrl}
                                                alt="Shop photo"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            {uploadLoading ? <Spin /> : <UploadOutlined />}
                                            <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                                        </div>
                                    )}
                                </Upload>
                            )}
                        </div>

                        <Card
                            title="Thống kê cửa hàng"
                            className="shop-stats"
                            bordered={false}
                            style={{ background: '#f9f9ff', borderRadius: '8px' }}
                        >
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Statistic
                                        title="Người theo dõi"
                                        value={shopProfile?.peopleTracking || 0}
                                        prefix={<TeamOutlined />}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title="Đánh giá"
                                        value={shopProfile?.rating || 0}
                                        precision={1}
                                        prefix={<StarOutlined />}
                                        suffix="/5"
                                    />
                                </Col>
                                <Col span={24}>
                                    <Statistic
                                        title="Số lượng sản phẩm"
                                        value={shopProfile?.productAmount || 0}
                                        prefix={<AppstoreOutlined />}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    {/* Right column - Form */}
                    <Col xs={24} md={16}>
                        <Form
                            form={form}
                            layout="vertical"
                            disabled={!editMode}
                            initialValues={{
                                name: shopProfile?.name || '',
                                description: shopProfile?.description || '',
                                phone: shopProfile?.phone || '',
                                city: selectedCity,
                                district: selectedDistrict,
                                ward: selectedWard,
                                detailAddress: detailAddress
                            }}
                        >
                            <Form.Item
                                name="name"
                                label="Tên cửa hàng"
                                rules={[{ required: true, message: 'Vui lòng nhập tên cửa hàng' }]}
                            >
                                <Input prefix={<ShopOutlined />} placeholder="Nhập tên cửa hàng" />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Mô tả"
                                rules={[{ required: true, message: 'Vui lòng nhập mô tả cửa hàng' }]}
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Nhập mô tả về cửa hàng của bạn"
                                />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="phone"
                                        label="Số điện thoại"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập số điện thoại' },
                                            { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                                        ]}
                                    >
                                        <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại liên hệ" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Title level={5}>Địa chỉ cửa hàng</Title>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        label="Tỉnh/Thành phố"
                                        name="city"
                                        rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành phố' }]}
                                    >
                                        <Select
                                            placeholder="Chọn tỉnh/thành phố"
                                            showSearch
                                            disabled={!editMode}
                                            value={selectedCity}
                                            onChange={handleCityChange}
                                            filterOption={(input, option) =>
                                                (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                                            }
                                        >
                                            {cities.map(city => (
                                                <Option key={city} value={city}>{city}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item
                                        label="Quận/Huyện"
                                        name="district"
                                        rules={[{ required: true, message: 'Vui lòng chọn Quận/Huyện' }]}
                                    >
                                        <Select
                                            placeholder="Chọn quận/huyện"
                                            showSearch
                                            disabled={!editMode || !selectedCity}
                                            value={selectedDistrict}
                                            onChange={handleDistrictChange}
                                            filterOption={(input, option) =>
                                                (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                                            }
                                        >
                                            {districts.map(district => (
                                                <Option key={district} value={district}>{district}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item
                                        label="Phường/Xã"
                                        name="ward"
                                        rules={[{ required: true, message: 'Vui lòng chọn Phường/Xã' }]}
                                    >
                                        <Select
                                            placeholder="Chọn phường/xã"
                                            showSearch
                                            disabled={!editMode || !selectedDistrict}
                                            value={selectedWard}
                                            onChange={handleWardChange}
                                            filterOption={(input, option) =>
                                                (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                                            }
                                        >
                                            {wards.map(ward => (
                                                <Option key={ward} value={ward}>{ward}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Địa chỉ chi tiết"
                                name="detailAddress"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết' }]}
                            >
                                <Input
                                    placeholder="Vd: 123 Lê Lợi"
                                    disabled={!editMode}
                                    value={detailAddress}
                                    onChange={(e) => setDetailAddress(e.target.value)}
                                />
                            </Form.Item>

                            {!editMode && (
                                <div>
                                    <Title level={4}>Thông tin bổ sung</Title>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Text type="secondary">Ngày tạo:</Text>
                                            <Text strong style={{ display: 'block' }}>
                                                {shopProfile?.createdAt
                                                    ? new Date(shopProfile.createdAt).toLocaleDateString('vi-VN')
                                                    : 'N/A'}
                                            </Text>
                                        </Col>
                                        <Col span={12}>
                                            <Text type="secondary">Cập nhật lần cuối:</Text>
                                            <Text strong style={{ display: 'block' }}>
                                                {shopProfile?.updatedAt
                                                    ? new Date(shopProfile.updatedAt).toLocaleDateString('vi-VN')
                                                    : 'N/A'}
                                            </Text>
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </Form>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default ShopProfilePage;
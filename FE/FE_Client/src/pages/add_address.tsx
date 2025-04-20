import React, { useEffect, useState, useCallback, useContext } from "react";
import { AuthContext } from "../components/context/auth.context";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, notification, Select } from "antd";
import axios from "axios";
import { addAddress, updateAddress, getAddressesByCustomer } from "../services/address.service";

const { Option } = Select;

interface AddressForm {
    fullName: string;
    phoneNumber: string;
    detailedAddress: string;
    city: string;
    district: string;
    ward: string;
}

interface Province {
    name: string;
}

interface District {
    name: string;
}

interface Ward {
    name: string;
}

const AddAddress: React.FC = () => {
    const { addressId } = useParams<{ addressId?: string }>();
      const { customer } = useContext(AuthContext);
      const customerId = customer?.id;
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

    // Lấy danh sách tỉnh/thành
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get("https://pmshoanghot-apitinhthanhdocker.hf.space/api/list");
                console.log("API provinces response:", response.data);
                setProvinces(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách tỉnh/thành:", error);
                notification.error({ message: "Không thể tải danh sách tỉnh/thành." });
            }
        };
        fetchProvinces();
    }, []);

    // Lấy danh sách quận/huyện
    const fetchDistricts = useCallback(async () => {
        if (selectedCity) {
            try {
                const response = await axios.get(
                    `https://pmshoanghot-apitinhthanhdocker.hf.space/api/city/${encodeURIComponent(selectedCity)}/districts`
                );
                console.log("API districts response:", response.data);
                setDistricts(response.data);
                setWards([]);
                form.setFieldsValue({ district: undefined, ward: undefined });
            } catch (error) {
                console.error("Lỗi khi lấy danh sách quận/huyện:", error);
                notification.error({ message: "Không thể tải danh sách quận/huyện." });
            }
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [selectedCity, form]);

    useEffect(() => {
        fetchDistricts();
    }, [fetchDistricts]);

    // Lấy danh sách xã/phường
    const fetchWards = useCallback(async () => {
        if (selectedCity && selectedDistrict) {
            try {
                const response = await axios.get(
                    `https://pmshoanghot-apitinhthanhdocker.hf.space/api/city/${encodeURIComponent(selectedCity)}/district/${encodeURIComponent(selectedDistrict)}/wards`
                );
                console.log("API wards response:", response.data);
                setWards(response.data);
                form.setFieldsValue({ ward: undefined });
            } catch (error) {
                console.error("Lỗi khi lấy danh sách xã/phường:", error);
                notification.error({ message: "Không thể tải danh sách xã/phường." });
            }
        } else {
            setWards([]);
        }
    }, [selectedCity, selectedDistrict, form]);

    useEffect(() => {
        fetchWards();
    }, [fetchWards]);

    // Lấy dữ liệu địa chỉ khi sửa
    useEffect(() => {
        if (addressId && customerId) {
            setLoading(true);
            getAddressesByCustomer(Number(customerId))
                .then((res) => {
                    const address = res.data.find((addr: any) => addr.id === Number(addressId));
                    if (address) {
                        form.setFieldsValue({
                            fullName: address.fullName || address.full_name,
                            phoneNumber: address.phoneNumber || address.phone_number,
                            detailedAddress: address.address,
                            city: address.city,
                        });
                        setSelectedCity(address.city);
                    }
                })
                .catch((error: any) => {
                    console.error("Error fetching address:", error);
                    notification.error({ message: "Không thể tải thông tin địa chỉ." });
                })
                .finally(() => setLoading(false));
        }
    }, [addressId, customerId, form]);

    const onFinish = async (values: AddressForm) => {
        console.log("onFinish được gọi với values:", values);

        // Hiển thị alert xác nhận
        const confirmed = window.confirm("Bạn có muốn thêm địa chỉ này?");
        if (!confirmed) {
            console.log("Hủy thêm địa chỉ");
            return;
        }

        setLoading(true);
        try {
            if (!customerId) {
                throw new Error("Không tìm thấy customerId.");
            }

            const token = localStorage.getItem("access_token");
            console.log("Access token:", token);
            if (!token) {
                throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
            }

            // Tạo chuỗi địa chỉ: detailedAddress + ward + district
            const fullAddress = `${values.detailedAddress}, ${values.ward}, ${values.district}`;

            const data = {
                customerId: Number(customerId),
                fullName: values.fullName,
                phoneNumber: values.phoneNumber,
                address: fullAddress,
                city: values.city,
                enable: true,
                default: false,
            };

            console.log("Data gửi đi:", data);

            let response;
            if (addressId) {
                response = await updateAddress(Number(addressId), data);
                console.log("Response từ updateAddress:", response.data);
                alert("Cập nhật địa chỉ thành công!");
            } else {
                response = await addAddress(data);
                console.log("Response từ addAddress:", response.data);
                alert("Đã thêm địa chỉ thành công!");
            }

            navigate(`/edit_address`);
        } catch (error: any) {
            console.error("Lỗi trong onFinish:", error);
            const errorMessage = error.response?.data?.message || error.message || "Không thể lưu địa chỉ.";
            notification.error({ message: errorMessage });
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log("Validation thất bại:", errorInfo);
        notification.error({ message: "Vui lòng kiểm tra lại các trường bắt buộc." });
    };

    return (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px" }}>
            <h2>{addressId ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}</h2>
            <Form
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
            >
                <Form.Item
                    name="fullName"
                    label="Họ và tên"
                    rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="phoneNumber"
                    label="Số điện thoại"
                    rules={[
                        { required: true, message: "Vui lòng nhập số điện thoại" },
                        { pattern: /^\d{10,11}$/, message: "Số điện thoại không hợp lệ" },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="city"
                    label="Tỉnh/Thành phố"
                    rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố" }]}
                >
                    <Select
                        showSearch
                        placeholder="Chọn tỉnh/thành phố"
                        onChange={(value) => setSelectedCity(value)}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                        }
                        loading={provinces.length === 0}
                    >
                        {provinces.map((province) => (
                            <Option key={province.name} value={province.name}>
                                {province.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="district"
                    label="Quận/Huyện"
                    rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}
                >
                    <Select
                        showSearch
                        placeholder="Chọn quận/huyện"
                        onChange={(value) => setSelectedDistrict(value)}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                        }
                        disabled={!selectedCity}
                        loading={!!selectedCity && districts.length === 0}
                    >
                        {districts.map((district) => (
                            <Option key={district.name} value={district.name}>
                                {district.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="ward"
                    label="Xã/Phường"
                    rules={[{ required: true, message: "Vui lòng chọn xã/phường" }]}
                >
                    <Select
                        showSearch
                        placeholder="Chọn xã/phường"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                        }
                        disabled={!selectedDistrict}
                        loading={!!selectedDistrict && wards.length === 0}
                    >
                        {wards.map((ward) => (
                            <Option key={ward.name} value={ward.name}>
                                {ward.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="detailedAddress"
                    label="Địa chỉ chi tiết"
                    rules={[{ required: true, message: "Vui lòng nhập địa chỉ chi tiết" }]}
                >
                    <Input placeholder="Ví dụ: 123 Lê Lợi" />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        disabled={loading}
                    >
                        {addressId ? "Cập nhật" : "Thêm mới"}
                    </Button>
                    <Button
                        style={{ marginLeft: 8 }}
                        onClick={() => navigate(`/edit_address`)}
                    >
                        Hủy
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddAddress;
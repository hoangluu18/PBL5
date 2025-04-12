import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, notification, Select, Spin, Card } from "antd";
import axios from "axios";
import { updateAddress, getAddressesByCustomer } from "../services/address.service";

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

const UpdateAddress: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerId, addressId } = location.state || {};
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [originalAddress, setOriginalAddress] = useState<any>(null);

  // Lấy danh sách tỉnh/thành
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("https://pmshoanghot-apitinhthanhdocker.hf.space/api/list");
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
        setDistricts(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quận/huyện:", error);
        notification.error({ message: "Không thể tải danh sách quận/huyện." });
      }
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedCity) {
      fetchDistricts();
    }
  }, [selectedCity, fetchDistricts]);

  // Lấy danh sách xã/phường
  const fetchWards = useCallback(async () => {
    if (selectedCity && selectedDistrict) {
      try {
        const response = await axios.get(
          `https://pmshoanghot-apitinhthanhdocker.hf.space/api/city/${encodeURIComponent(selectedCity)}/district/${encodeURIComponent(selectedDistrict)}/wards`
        );
        setWards(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách xã/phường:", error);
        notification.error({ message: "Không thể tải danh sách xã/phường." });
      }
    }
  }, [selectedCity, selectedDistrict]);

  useEffect(() => {
    if (selectedCity && selectedDistrict) {
      fetchWards();
    }
  }, [selectedCity, selectedDistrict, fetchWards]);

  // Phân tích địa chỉ thành các phần
  const parseAddress = useCallback((fullAddress: string) => {
    const parts = fullAddress.split(",").map(part => part.trim());
    let detailedAddress = parts[0] || "";
    let ward = parts.length > 1 ? parts[1] : "";
    let district = parts.length > 2 ? parts[2] : "";
    return { detailedAddress, ward, district };
  }, []);

  // Lấy thông tin địa chỉ cần sửa
  useEffect(() => {
    const fetchAddressDetails = async () => {
      if (!addressId || !customerId) {
        console.log("Missing customerId or addressId, redirecting to /edit_address");
        notification.error({ message: "Thiếu thông tin địa chỉ" });
        navigate("/edit_address");
        return;
      }

      setInitialLoading(true);
      try {
        const res = await getAddressesByCustomer(Number(customerId));
        const address = res.data.find((addr: any) => addr.id === Number(addressId));

        if (!address) {
          console.log("Address not found, redirecting to /edit_address");
          notification.error({ message: "Không tìm thấy địa chỉ" });
          navigate("/edit_address");
          return;
        }

        setOriginalAddress(address);

        const { detailedAddress, ward, district } = parseAddress(address.address);

        setSelectedCity(address.city);

        setTimeout(() => {
          setSelectedDistrict(district);
          form.setFieldsValue({
            fullName: address.fullName || address.full_name,
            phoneNumber: address.phoneNumber || address.phone_number,
            detailedAddress: detailedAddress,
            city: address.city,
            district: district,
            ward: ward,
          });
          setInitialLoading(false);
        }, 1000);
      } catch (error: any) {
        console.error("Lỗi khi lấy thông tin địa chỉ:", error);
        console.log("Error occurred, redirecting to /edit_address");
        notification.error({ message: "Không thể tải thông tin địa chỉ" });
        navigate("/edit_address");
      }
    };

    fetchAddressDetails();
  }, [addressId, customerId, form, navigate, parseAddress]);

  const onFinish = async (values: AddressForm) => {
    const confirmed = window.confirm("Bạn có muốn cập nhật địa chỉ này?");
    if (!confirmed) {
      return;
    }

    setLoading(true);
    try {
      if (!customerId || !addressId) {
        throw new Error("Thiếu thông tin địa chỉ");
      }

      const fullAddress = `${values.detailedAddress}, ${values.ward}, ${values.district}`;

      const data = {
        customerId: Number(customerId),
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        address: fullAddress,
        city: values.city,
        enable: true,
        default: originalAddress?.default || originalAddress?.isDefault || false,
      };

      await updateAddress(Number(addressId), data);
      notification.success({ message: "Cập nhật địa chỉ thành công!" });
      navigate("/edit_address");
    } catch (error: any) {
      console.error("Lỗi khi cập nhật địa chỉ:", error);
      const errorMessage = error.response?.data?.message || error.message || "Không thể cập nhật địa chỉ";
      notification.error({ message: errorMessage });
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    notification.error({ message: "Vui lòng kiểm tra lại các trường bắt buộc" });
  };

  if (initialLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" tip="Đang tải thông tin địa chỉ..." />
      </div>
    );
  }

  return (
    <Card
      title="Chỉnh sửa địa chỉ"
      style={{ maxWidth: 600, margin: "40px auto", borderRadius: "8px", boxShadow: "0 3px 6px rgba(0,0,0,0.1)" }}
    >
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        initialValues={{
          fullName: "",
          phoneNumber: "",
          city: "",
          district: "",
          ward: "",
          detailedAddress: "",
        }}
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
            onChange={(value) => {
              setSelectedCity(value);
              form.setFieldsValue({ district: undefined, ward: undefined });
            }}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
            }
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
            onChange={(value) => {
              setSelectedDistrict(value);
              form.setFieldsValue({ ward: undefined });
            }}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
            }
            disabled={!selectedCity}
            loading={districts.length === 0 && !!selectedCity}
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
            loading={wards.length === 0 && !!selectedDistrict}
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
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading} style={{ marginRight: 8 }}>
            Cập nhật
          </Button>
          <Button onClick={() => navigate("/edit_address")}>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UpdateAddress;
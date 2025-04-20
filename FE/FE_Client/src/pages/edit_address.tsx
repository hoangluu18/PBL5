import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";
import { getAddressesByCustomer, updateAddress, disableAddress } from "../services/address.service";
import {
    Card,
    Col,
    Row,
    Tag,
    Button,
    Typography,
    Spin,
    Empty,
    Space,
    Modal,
    notification,
} from "antd";
import {
    HomeOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    CheckCircleOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    BankOutlined,
} from "@ant-design/icons";
import { setDefaultAddress } from "../services/address.service";
const { Title, Text } = Typography;

interface Address {
    id: number;
    fullName: string;
    phoneNumber: string;
    address: string;
    city: string;
    isDefault: number;
}

const EditAddress: React.FC = () => {
    // const { id } = useParams<{ id: string }>();
    // const customerId = Number(id);
    const { customer } = useContext(AuthContext);
    const customerId = customer?.id;
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectedAddress, setSelectedAddress] = useState<number | null>(null);

    useEffect(() => {
        if (!customerId) return;
        fetchAddresses();
    }, [customerId]);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const res = await getAddressesByCustomer(customerId);
            const mappedAddresses = res.data.map((addr: any) => ({
                id: addr.id,
                fullName: addr.fullName || addr.full_name,
                phoneNumber: addr.phoneNumber || addr.phone_number,
                address: addr.address,
                city: addr.city,
                isDefault: addr.isDefault || addr.default || 0,
            }));
            setAddresses(mappedAddresses);
        } catch (error: any) {
            console.error("Lỗi khi lấy địa chỉ:", error);
            if (error.response?.status === 401) {
                notification.error({ message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại." });
                navigate("/login");
            } else {
                notification.error({ message: "Không thể tải danh sách địa chỉ. Vui lòng thử lại." });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (addressId: number) => {
        console.log("Navigating to /update_address with:", { customerId, addressId });
        navigate("/update_address", {
            state: { customerId, addressId },
        });
    };

    const showDisableModal = (addressId: number) => {
        setSelectedAddress(addressId);
        setIsModalVisible(true);
    };

    const handleDisable = async () => {
        if (selectedAddress) {
            try {
                await disableAddress(selectedAddress);
                setAddresses(addresses.filter((addr) => addr.id !== selectedAddress));
                notification.success({ message: "Vô hiệu hóa địa chỉ thành công!" });
            } catch (error: any) {
                console.error("Error disabling address:", error);
                if (error.response?.status === 401) {
                    notification.error({ message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại." });
                    navigate("/login");
                } else {
                    notification.error({ message: "Không thể vô hiệu hóa địa chỉ. Vui lòng thử lại." });
                }
            }
        }
        setIsModalVisible(false);
        setSelectedAddress(null);
    };

    const handleSetDefault = async (id: number) => {
        try {
            await setDefaultAddress(id, customerId);
            alert("Đã đặt địa chỉ mặc định thành công!");
            // Gọi lại danh sách địa chỉ để cập nhật UI
            fetchAddresses();
        } catch (error) {
            console.error("Lỗi khi đặt địa chỉ mặc định:", error);
        }
    };

    const handleAddNew = () => {
        navigate(`/add-address`);
    };

    if (loading) {
        return <div style={{ textAlign: "center", padding: "80px 0" }}><Spin size="large" /></div>;
    }

    return (
        <div
            className="address-management-container"
            style={{
                background: "white",
                padding: "24px",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                maxWidth: "1200px",
                margin: "0 auto",
                marginTop: "40px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                    borderBottom: "1px solid #f0f0f0",
                    paddingBottom: "16px",
                }}
            >
                <Title level={4} style={{ margin: 0, display: "flex", alignItems: "center" }}>
                    <HomeOutlined style={{ marginRight: "10px" }} /> Sổ địa chỉ
                </Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
                    Thêm địa chỉ mới
                </Button>
            </div>

            {addresses.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {addresses.map((addr) => (
                        <Col xs={24} sm={12} lg={8} key={addr.id}>
                            <Card
                                className="address-card"
                                bordered={false}
                                style={{
                                    borderRadius: "8px",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                                    height: "100%",
                                    position: "relative",
                                }}
                            >
                                <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
                                    <Text strong style={{ fontSize: "16px", flex: 1 }}>
                                        {addr.fullName}
                                    </Text>
                                    {Boolean(addr.isDefault) && (
                                        <Tag color="success" style={{ marginLeft: "8px" }}>
                                            <CheckCircleOutlined /> Mặc định
                                        </Tag>
                                    )}
                                </div>
                                <div className="address-info-container">
                                    {/* Số điện thoại */}
                                    <div className="address-info-row">
                                        <PhoneOutlined className="address-icon" style={{ color: "#1890ff" }} />
                                        <Text>{addr.phoneNumber}</Text>
                                    </div>

                                    {/* Địa chỉ - giới hạn 2 dòng */}
                                    <div className="address-info-row">
                                        <EnvironmentOutlined className="address-icon" style={{ color: "#ff4d4f" }} />
                                        <Text
                                            className="address-text"
                                            style={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }}
                                        >
                                            {addr.address}
                                        </Text>
                                    </div>

                                    {/* Tỉnh thành */}
                                    <div className="address-info-row">
                                        <BankOutlined className="address-icon" style={{ color: "#52c41a" }} />
                                        <Text>{addr.city}</Text>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        borderTop: "1px solid #f0f0f0",
                                        paddingTop: "16px",
                                        marginTop: "16px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Space>
                                        <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(addr.id)}>
                                            Sửa
                                        </Button>
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => showDisableModal(addr.id)}
                                        >
                                            Vô hiệu hóa
                                        </Button>
                                    </Space>
                                    {!Boolean(addr.isDefault) && (
                                        <Button type="link" onClick={() => handleSetDefault(addr.id)}>
                                            Đặt làm mặc định
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <Text style={{ fontSize: "16px", color: "#666" }}>
                            Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới.
                        </Text>
                    }
                    style={{ margin: "60px 0" }}
                >
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
                        Thêm địa chỉ mới
                    </Button>
                </Empty>
            )}

            <Modal
                title="Xác nhận vô hiệu hóa"
                open={isModalVisible}
                onOk={handleDisable}
                onCancel={() => setIsModalVisible(false)}
                okText="Vô hiệu hóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn vô hiệu hóa địa chỉ này không?</p>
            </Modal>

            <style>{`
                .address-card {
                    transition: all 0.3s ease;
                }
                .address-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .address-management-container {
                    transition: all 0.3s ease;
                }
                .address-management-container:hover {
                    box-shadow: 0 3px 6px rgba(0,0,0,0.15);
                }
                .ant-card-body {
                    padding: 20px;
                }
                    .address-info-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 16px;
        }
        
        .address-info-row {
            display: flex;
            align-items: flex-start;
            min-height: 24px;
        }
        
        .address-icon {
            margin-right: 8px;
            font-size: 16px;
            margin-top: 2px;
        }
        
        .address-text {
            min-height: 40px;
        }
            `}</style>
        </div>
    );
};

export default EditAddress;
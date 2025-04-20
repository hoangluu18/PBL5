import { Card, Avatar, Tabs, Button, Divider, Tag, Typography, Spin, Modal, notification } from "antd";
import { UploadOutlined, ShoppingOutlined, ClockCircleOutlined, DollarOutlined, HomeOutlined, CheckCircleOutlined, PhoneOutlined, EnvironmentOutlined, BankOutlined, PlusOutlined } from "@ant-design/icons";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/context/auth.context";
import { useNavigate } from "react-router-dom";
import OrderList from "../components/profile/OrderList";
import ProfileReview from "../components/ProfileReview";
import FollowedStores from "../components/product_details/FollowedStores";
import ProfileService from "../services/profile.service";
import { getAddressesByCustomer, disableAddress } from "../services/address.service";
import IProfile from "../models/dto/Profile";
import uploadService from "../services/aws_service/upload.service";

const { TabPane } = Tabs;
const { Text } = Typography;

interface Address {
    id: number;
    fullName: string;
    phoneNumber: string;
    address: string;
    city: string;
    isDefault: number;
}


const ProfilePage: React.FC = () => {
    const { customer, setCustomer } = useContext(AuthContext);
    const customerId = customer?.id;
    //const { customerId } = useParams<{ customerId: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<IProfile | null>(null);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const profileService = new ProfileService();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewModalVisible, setPreviewModalVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!customerId) return;
            setLoading(true);
            try {
                // Lấy thông tin profile
                const profileData = await profileService.getProfile(customerId);
                if (profileData) {
                    setProfile(profileData);
                    setAvatar(profileData.avatar);
                }

                // Lấy địa chỉ mặc định
                const addressData = await getAddressesByCustomer(customerId);
                const mappedAddresses = addressData.data.map((addr: any) => ({
                    id: addr.id,
                    fullName: addr.fullName || addr.full_name,
                    phoneNumber: addr.phoneNumber || addr.phone_number,
                    address: addr.address,
                    city: addr.city,
                    isDefault: addr.isDefault || addr.default || 0,
                }));
                const defaultAddr = mappedAddresses.find((addr: Address) => Boolean(addr.isDefault)) || null;
                setDefaultAddress(defaultAddr);
            } catch (error: any) {
                console.error("Error fetching data:", error);
                if (error.response?.status === 401) {
                    notification.error({ message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại." });
                    navigate("/login");
                } else {
                    notification.error({ message: "Không thể tải dữ liệu. Vui lòng thử lại." });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [customerId, navigate]);

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && customerId) {
            if (file.size > 5 * 1024 * 1024) {
                notification.error({
                    message: 'File quá lớn',
                    description: 'Kích thước ảnh không được vượt quá 5MB',
                });
                return;
            }

            // Kiểm tra loại file
            if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
                notification.error({
                    message: 'Định dạng không được hỗ trợ',
                    description: 'Vui lòng sử dụng các định dạng ảnh: JPEG, PNG, GIF, WEBP',
                });
                return;
            }

            // Tạo preview và hiển thị modal
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
                setPreviewModalVisible(true);
            }
            reader.readAsDataURL(file);
            setImageFile(file);
        }
    };

    // Hàm xử lý khi người dùng xác nhận upload
    const confirmUpload = async () => {
        if (imageFile && customerId) {
            try {
                const key = 'loadingNotification';
                notification.info({
                    key,
                    message: 'Đang tải ảnh lên...',
                    duration: 0
                });

                const avatarUrl = await uploadService.uploadAvatar(customerId, imageFile);

                setAvatar(avatarUrl);
                setPreviewModalVisible(false);
                setImageFile(null);

                if (customer) {
                    const updatedCustomer = { ...customer, avatar: avatarUrl };
                    localStorage.setItem('customer', JSON.stringify(updatedCustomer));
                    setCustomer(updatedCustomer);
                }

                notification.info.close(key);
                notification.success({
                    message: 'Cập nhật ảnh đại diện thành công!',
                    duration: 3
                });
            } catch (error: any) {
                notification.error({
                    message: 'Không thể tải ảnh lên',
                    description: error.response?.data?.error || 'Đã xảy ra lỗi khi tải ảnh lên',
                    duration: 3
                });
                console.error('Error uploading avatar:', error);
            }
        }
    };


    const handleDisableAddress = async () => {
        if (selectedAddressId) {
            try {
                await disableAddress(selectedAddressId);
                setDefaultAddress(null); // Xóa địa chỉ mặc định khỏi giao diện
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
        setSelectedAddressId(null);
    };

    const handleAddNew = () => {
        navigate(`/add-address`);
    };

    const handleManageAddresses = () => {
        navigate(`/edit-address`);
    };

    const formatJoinDate = (dateStr: string | null): string => {
        if (!dateStr) return "Chưa có thông tin";
        const joinDate = new Date(dateStr);
        const currentDate = new Date();
        const timeDiffMs = currentDate.getTime() - joinDate.getTime();
        const daysDiff = Math.floor(timeDiffMs / (1000 * 60 * 60 * 24));
        if (daysDiff < 30) {
            return `Tham gia từ ${daysDiff} ngày trước`;
        } else if (daysDiff < 365) {
            const monthsDiff = Math.floor(daysDiff / 30);
            return `Tham gia từ ${monthsDiff} tháng trước`;
        } else {
            const yearsDiff = Math.floor(daysDiff / 365);
            return `Tham gia từ ${yearsDiff} năm trước`;
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "Chưa có";
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    if (loading) {
        return <div style={{ textAlign: "center", padding: "80px 0" }}><Spin size="large" /></div>;
    }

    if (!profile) {
        return <div>Không tìm thấy thông tin người dùng.</div>;
    }

    return (
        <div className="container mt-4">
            <h2>Hồ sơ cá nhân</h2>

            <div style={{ display: "flex", gap: "20px" }}>
                <Card style={{ flex: 2, borderRadius: "12px", padding: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <label htmlFor="avatar-upload" style={{ cursor: "pointer", position: "relative" }}>
                            <Avatar size={100} src={avatar || "https://via.placeholder.com/100"} />
                            <input
                                type="file"
                                id="avatar-upload"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />
                            <div style={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                background: "#1890ff",
                                borderRadius: "50%",
                                padding: "5px",
                                fontSize: "16px",
                                color: "white",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                            }}>
                                <UploadOutlined />
                            </div>
                        </label>
                        <div>
                            <h2 style={{ marginBottom: "5px", fontSize: "24px" }}>{profile.fullName}</h2>
                            <p style={{ color: "#666", marginBottom: 0 }}>{formatJoinDate(profile.createdAt)}</p>
                        </div>
                    </div>

                    <Divider />

                    <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
                        <div className="stat-card">
                            <DollarOutlined style={{ fontSize: "24px", color: "#52c41a", marginBottom: "8px" }} />
                            <strong style={{ display: "block", fontSize: "14px", color: "#666" }}>Đã chi tiêu</strong>
                            <p style={{ fontSize: "22px", fontWeight: "bold", margin: "8px 0 0", color: "#222" }}>
                                {profile.totalSpent.toLocaleString("vi-VN")}₫
                            </p>
                        </div>
                        <div className="stat-card">
                            <ClockCircleOutlined style={{ fontSize: "24px", color: "#1890ff", marginBottom: "8px" }} />
                            <strong style={{ display: "block", fontSize: "14px", color: "#666" }}>Đơn hàng gần nhất</strong>
                            <p style={{ fontSize: "18px", margin: "8px 0 0", color: "#222" }}>{formatDate(profile.lastOrder)}</p>
                        </div>
                        <div className="stat-card">
                            <ShoppingOutlined style={{ fontSize: "24px", color: "#722ed1", marginBottom: "8px" }} />
                            <strong style={{ display: "block", fontSize: "14px", color: "#666" }}>Tổng đơn hàng</strong>
                            <p style={{ fontSize: "22px", fontWeight: "bold", margin: "8px 0 0", color: "#222" }}>
                                {profile.totalOrder}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card style={{ flex: 1, borderRadius: "12px", padding: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                        <h3 style={{ margin: 0, display: "flex", alignItems: "center" }}>
                            <HomeOutlined style={{ marginRight: "10px" }} /> Thông tin giao hàng
                        </h3>
                        {!defaultAddress && (
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
                                Thêm địa chỉ mới
                            </Button>
                        )}
                    </div>

                    {defaultAddress ? (
                        <Card
                            className="address-card"
                            bordered={false}
                            style={{
                                borderRadius: "8px",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                                marginBottom: "20px",
                            }}
                        >
                            <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
                                <Text strong style={{ fontSize: "16px", flex: 1 }}>
                                    {defaultAddress.fullName}
                                </Text>
                                <Tag color="success" style={{ marginLeft: "8px" }}>
                                    <CheckCircleOutlined /> Mặc định
                                </Tag>
                            </div>

                            <div style={{ marginBottom: "12px" }}>
                                <PhoneOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
                                <Text>{defaultAddress.phoneNumber}</Text>
                            </div>

                            <div style={{ marginBottom: "12px" }}>
                                <EnvironmentOutlined style={{ marginRight: "8px", color: "#ff4d4f" }} />
                                <Text>{defaultAddress.address}</Text>
                            </div>

                            <div style={{ marginBottom: "12px" }}>
                                <BankOutlined style={{ marginRight: "8px", color: "#52c41a" }} />
                                <Text>{defaultAddress.city}</Text>
                            </div>

                            <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px", marginTop: "16px", display: "flex", justifyContent: "space-between" }}>
                                <Button type="link" onClick={handleManageAddresses}>
                                    Quản lý địa chỉ
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <div style={{ textAlign: "center", padding: "20px" }}>
                            <Text style={{ fontSize: "16px", color: "#666" }}>
                                Bạn chưa có địa chỉ mặc định. Hãy thêm địa chỉ mới.
                            </Text>
                            <div style={{ marginTop: "16px" }}>
                                <Button type="link" onClick={handleManageAddresses}>
                                    Quản lý địa chỉ
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            <Tabs defaultActiveKey="1" className="mt-3" type="card" size="large">
                <TabPane tab="Lịch sử mua" key="1">
                    <OrderList />
                </TabPane>
                <TabPane tab="Bài đánh giá" key="2">
                    <ProfileReview id={customerId || 0} />
                </TabPane>
                <TabPane tab="Theo dõi" key="3">
                    <FollowedStores customerId={customerId || 0} />
                </TabPane>
            </Tabs>

            <Modal
                title="Xác nhận vô hiệu hóa"
                open={isModalVisible}
                onOk={handleDisableAddress}
                onCancel={() => setIsModalVisible(false)}
                okText="Vô hiệu hóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn vô hiệu hóa địa chỉ này không?</p>
            </Modal>

            <Modal
                title="Xem trước ảnh đại diện"
                open={previewModalVisible}
                onOk={confirmUpload}
                onCancel={() => setPreviewModalVisible(false)}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <div style={{ textAlign: 'center' }}>
                    <Avatar
                        size={200}
                        src={previewImage || undefined}
                        style={{ marginBottom: '20px' }}
                    />
                    <p>Xác nhận sử dụng ảnh này làm ảnh đại diện?</p>
                </div>
            </Modal>

            <style>{`
                .stat-card {
                    text-align: center;
                    padding: 10px;
                    border-radius: 8px;
                    transition: all 0.3s;
                }
                .stat-card:hover {
                    background-color: #f5f5f5;
                    transform: translateY(-3px);
                }
                .address-card {
                    transition: all 0.3s ease;
                }
                .address-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
            `}</style>
        </div>
    );
};

export default ProfilePage;
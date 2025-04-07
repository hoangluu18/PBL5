// src/components/ProfilePage.tsx
import { Card, Avatar, Tabs, Input, Button, Divider } from "antd";
import { EditOutlined, UploadOutlined, ShoppingOutlined, ClockCircleOutlined, DollarOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import OrderList from "../components/profile/OrderList";
import ReviewList from "../components/product_details/ProductReviews";
import FollowedStores from "../components/product_details/FollowedStores";
import ProfileReview from "../components/ProfileReview"; // Adjust the path as needed
import ProfileService from "../services/profile.service";
import IProfile from "../models/dto/Profile";


const { TabPane } = Tabs;

const ProfilePage: React.FC = () => {
    const { customerId } = useParams<{ customerId: string }>();
    const [profile, setProfile] = useState<IProfile | null>(null);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [editingField, setEditingField] = useState("");
    const [avatar, setAvatar] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const profileService = new ProfileService();

    useEffect(() => {
        const fetchProfile = async () => {
            if (customerId) {
                try {
                    const data = await profileService.getProfile(parseInt(customerId, 10));
                    if (data) {
                        setProfile(data);
                        setEmail(data.email);
                        setPhone(data.phone);
                        setAvatar(data.avatar);
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProfile();
    }, [customerId]);

    const handleEdit = (field: string) => {
        setEditingField(field);
    };

    const handleBlur = () => {
        setEditingField("");
        // TODO: Gọi API để cập nhật email/phone nếu cần
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setAvatar(e.target?.result as string);
            reader.readAsDataURL(file);
            // TODO: Gọi API để upload avatar nếu cần
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!profile) {
        return <div>Không tìm thấy thông tin người dùng.</div>;
    }

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
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="container mt-4">
            <h2>Hồ sơ cá nhân</h2>

            <div style={{ display: "flex", gap: "20px" }}>
            <Card style={{ flex: 2, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
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
            <p style={{ 
              fontSize: "22px", 
              fontWeight: "bold", 
              margin: "8px 0 0", 
              color: "#222" 
            }}>
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

                <Card style={{ flex: 1, borderRadius: "12px", padding: "20px" }}>
                    <h3>
                        Thông tin giao hàng
                        <Link to="/edit_address" className="ms-3">
                            <Button type="primary" icon={<EditOutlined />} size="small" />
                        </Link>
                    </h3>
                    <p>
                        <strong>Địa chỉ</strong>
                        <br /> {profile.defaultAddress || "Chưa có địa chỉ mặc định"}
                    </p>

                    <p>
                        <strong>Email</strong>
                        <br />
                        {editingField === "email" ? (
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={handleBlur}
                                onPressEnter={handleBlur}
                                autoFocus
                            />
                        ) : (
                            <>
                                {email} <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit("email")} />
                            </>
                        )}
                    </p>

                    <p>
                        <strong>Số điện thoại</strong>
                        <br />
                        {editingField === "phone" ? (
                            <Input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                onBlur={handleBlur}
                                onPressEnter={handleBlur}
                                autoFocus
                            />
                        ) : (
                            <>
                                {phone} <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit("phone")} />
                            </>
                        )}
                    </p>
                </Card>
            </div>

            <Tabs 
      defaultActiveKey="1" 
      className="mt-3" 
      type="card"
      size="large"
    >
                <TabPane tab="Lịch sử mua" key="1">
                    <OrderList />
                </TabPane>
                <TabPane tab={`Bài đánh giá`} key="2">
    <ProfileReview id={parseInt(customerId || "0", 10)} />
</TabPane>
                <TabPane tab="Theo dõi" key="3">
                <FollowedStores customerId={parseInt(customerId || "0", 10)} />
                </TabPane>
            </Tabs>
        
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
    `}</style></div>
    );
};

export default ProfilePage;
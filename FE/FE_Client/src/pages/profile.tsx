import { Card, Avatar, Tabs, Input, Button, Divider } from "antd";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import OrderList from "../components/profile/OrderList";
import ReviewList from "../components/product_details/ProductReviews";
import FollowedStores from "../components/product_details/FollowedStores";
import { Link } from "react-router-dom";

const { TabPane } = Tabs;

const profileData = {
    name: "Ansolo Lazinotov",
    joined: "Joined 3 months ago",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    totalSpent: "$894",
    lastOrder: "1 week ago",
    totalOrders: 97,
    email: "shatinon@jeemail.com",
    phone: "+1234567890",
    address: "Vancouver, British Columbia, Canada",
};

const ProfilePage = () => {
    const [email, setEmail] = useState(profileData.email);
    const [phone, setPhone] = useState(profileData.phone);
    const [editingField, setEditingField] = useState("");
    const [avatar, setAvatar] = useState(profileData.avatar);

    const handleEdit = (field: string) => {
        setEditingField(field);
    };

    const handleBlur = () => {
        setEditingField("");
    };

    const handleImageChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setAvatar(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Profile</h2>

            {/* Profile Header */}
            <div style={{ display: "flex", gap: "20px" }}>
                <Card style={{ flex: 2, borderRadius: "12px", padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        {/* Upload Avatar */}
                        <label htmlFor="avatar-upload" style={{ cursor: "pointer", position: "relative" }}>
                            <Avatar size={90} src={avatar} />
                            <input
                                type="file"
                                id="avatar-upload"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />
                            <UploadOutlined
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                    background: "white",
                                    borderRadius: "50%",
                                    padding: "5px",
                                    fontSize: "14px",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                }}
                            />
                        </label>
                        <div>
                            <h2>{profileData.name}</h2>
                            <p>{profileData.joined}</p>
                        </div>
                    </div>
                    <Divider />

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                        <div><strong>Total Spent</strong><p>{profileData.totalSpent}</p></div>
                        <div><strong>Last Order</strong><p>{profileData.lastOrder}</p></div>
                        <div><strong>Total Orders</strong><p>{profileData.totalOrders}</p></div>
                    </div>
                </Card>

                {/* User Info Card */}
                <Card style={{ flex: 1, borderRadius: "12px", padding: "20px" }}>
                    <h3>
                        Default Address
                        <Link to="/edit_address" className="ms-3">
                            <Button type="primary" icon={<EditOutlined />} size="small" />
                        </Link>
                    </h3>
                    <p><strong>Address</strong><br /> {profileData.address}</p>

                    {/* Editable Email */}
                    <p>
                        <strong>Email</strong><br />
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

                    {/* Editable Phone */}
                    <p>
                        <strong>Phone</strong><br />
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

            {/* Profile Tabs */}
            <Tabs defaultActiveKey="1" className="mt-3">
                <TabPane tab="Orders" key="1">
                    <OrderList />
                </TabPane>
                <TabPane tab="Reviews (24)" key="2">
                    <ReviewList />
                </TabPane>
                <TabPane tab="Stores" key="3">
                    <FollowedStores />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default ProfilePage;

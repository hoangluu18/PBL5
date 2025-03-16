import { Card, Avatar, Tabs, Table, Tag, Input, Button, Divider } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import OrderList from "../components/profile/OrderList";
import ReviewList from "../components/product_details/ReviewList";
import FollowedShops from "./followed_shops";
import FollowedStores from "../components/product_details/FollowedStores";

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

    // When clicking edit, set the field to be editable
    const handleEdit = (field: string) => {
        setEditingField(field);
    };

    // Save changes when clicking outside input or pressing Enter
    const handleBlur = () => {
        setEditingField(""); // Exit editing mode
    };

    return (
        <div className="container mt-3">
            <div>
                <h2>Profile</h2>
            </div>
            {/* Header Section */}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
                <Card style={{ flex: 2, borderRadius: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <Avatar size={80} src={profileData.avatar} />
                        <div>
                            <h2>{profileData.name}</h2>
                            <p>{profileData.joined}</p>
                        </div>
                    </div>
                    <Divider />

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
                        <div><strong>Total Spent</strong><p>{profileData.totalSpent}</p></div>
                        <div><strong>Last Order</strong><p>{profileData.lastOrder}</p></div>
                        <div><strong>Total Orders</strong><p>{profileData.totalOrders}</p></div>
                    </div>
                </Card>
                <Card style={{ flex: 1, borderRadius: "8px" }}>
                    <h3>Default Address</h3>
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

            {/* Tabs Section */}
            <Tabs defaultActiveKey="1">
                <TabPane tab="Orders" key={1}>
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

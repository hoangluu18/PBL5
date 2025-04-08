import React, { useState, useEffect } from "react";
import { Table, Empty, Typography, Spin, Avatar } from "antd";
import { ShopOutlined, StarFilled, ShoppingOutlined, DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import FollowingShopService from "../../services/following_shop.service";
import IFollowingShopDto from "../../models/dto/FollowingShopDto";

const { Title, Text } = Typography;

interface FollowedStoresProps {
    customerId?: number; // Nhận customerId từ ProfilePage
}

const FollowedStores: React.FC<FollowedStoresProps> = ({ customerId }) => {
    const [shops, setShops] = useState<IFollowingShopDto[]>([]);
    const [loading, setLoading] = useState(true);
    const followingShopService = new FollowingShopService();

    useEffect(() => {
        const fetchFollowedShops = async () => {
            if (customerId) {
                try {
                    const data = await followingShopService.getFollowingShops(1, customerId); // pageNum mặc định là 1
                    setShops(data);
                } catch (error) {
                    console.error("Error fetching shops:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchFollowedShops();
    }, [customerId]);

// Hàm render sao dựa trên rating
const renderStars = (rating: any) => {
    const numRating = parseFloat(rating) || 0;
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}> {/* Thêm justifyContent: "center" */}
            {[...Array(5)].map((_, i) => (
                <StarFilled 
                    key={i} 
                    style={{ 
                        fontSize: '16px', 
                        color: i < Math.floor(numRating) ? "#FADB14" : "#E8E8E8",
                        marginRight: '2px'
                    }} 
                />
            ))}
            <Text style={{ marginLeft: 8, color: '#666' }}>({numRating.toFixed(1)})</Text>
        </div>
    );
};

    // Hàm format ngày giờ
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).replace(",", "");
    };

    // Định nghĩa cột cho Table
    const columns = [
        {
            title: "Cửa hàng",
            dataIndex: "shopName",
            key: "shopName",
            width: 300, // Đặt độ rộng cố định cho cột này
            render: (text: string, record: IFollowingShopDto) => (
                <div className="shop-column-content" style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ paddingLeft: 46, display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            src={record.photo ? `http://localhost:5173/src/assets/shop-images/shop2.png` : "https://via.placeholder.com/40"}
                            alt={text}
                            size={50}
                            style={{ marginRight: 12 }}
                        />
                        <div>
                            <Text strong style={{ fontSize: "16px", display: "block" }}>{text}</Text>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Đánh giá",
            dataIndex: "rating",
            key: "rating",
            render: (rating: number) => renderStars(rating),
        },
        {
            title: "Tổng đơn hàng",
            dataIndex: "totalOrders",
            key: "totalOrders",
            render: (totalOrders: number) => (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ShoppingOutlined 
                        style={{ 
                            color: "#722ed1", 
                            marginRight: 5,
                            fontSize: "16px"
                        }} 
                    />
                    <Text strong>{totalOrders}</Text>
                </div>
            ),
        },
        {
            title: "Đã chi tiêu",
            dataIndex: "totalSpent",
            key: "totalSpent",
            render: (totalSpent: number) => (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <DollarOutlined 
                        style={{ 
                            color: "#52c41a", 
                            marginRight: 5,
                            fontSize: "16px"
                        }} 
                    />
                    <Text strong style={{ fontSize: "15px" }}>
                        {Math.floor(totalSpent).toLocaleString("vi-VN")}₫
                    </Text>
                </div>
            ),
        },
        {
            title: "Đơn hàng gần nhất",
            dataIndex: "lastOrder",
            key: "lastOrder",
            render: (lastOrder: string) => (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ClockCircleOutlined 
                        style={{ 
                            color: "#1890ff", 
                            marginRight: 5,
                            fontSize: "16px"
                        }} 
                    />
                    <Text>{formatDate(lastOrder)}</Text>
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <div style={{ padding: "40px 0", textAlign: "center" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="followed-shops-container" style={{ 
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
            <Title level={4} style={{ 
                marginBottom: 5, 
                display: "flex", 
                alignItems: "center",
                paddingBottom: "5px"
            }}>
            </Title>
            
            {shops.length > 0 ? (
                <Table
                    dataSource={shops}
                    columns={columns}
                    rowKey="shopId"
                    pagination={false}
                    className="followed-shops-table"
                    bordered={false}
                    style={{ marginBottom: "16px" }}
                    rowClassName={() => "shop-row"}
                />
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <Text style={{ fontSize: "16px", color: "#666" }}>
                            Bạn chưa theo dõi shop nào.
                        </Text>
                    }
                    style={{ margin: "40px 0" }}
                />
            )}
            
            {/* CSS inline */}
            <style>{`
    .shop-row:hover {
        background-color: #f5f5f5;
    }
    .followed-shops-table .ant-table-thead > tr > th {
        background-color: #fafafa;
        font-weight: 600;
        text-align: center;
    }
    .followed-shops-table .ant-table-cell {
        padding: 16px 8px;
        text-align: center;
    }
        
    /* Căn trái cho cột cửa hàng */
    .followed-shops-table th:first-child ,
    .followed-shops-table td:first-child {
        padding-left: center;
    }
    /* Căn trái cho cột đánh giá */
    .followed-shops-table th:nth-child(2),
    .followed-shops-table td:nth-child(2) {
        text-align: center;
    }
    /* Căn giữa cho các cột còn lại */
    .followed-shops-table th:nth-child(n+3),
    .followed-shops-table td:nth-child(n+3) {
        text-align: center;
    }
    .followed-shops-container {
        transition: all 0.3s ease;
    }
    .followed-shops-container:hover {
        box-shadow: 0 3px 6px rgba(0,0,0,0.15);
    }
        
`}</style>
        </div>
    );
};

export default FollowedStores;
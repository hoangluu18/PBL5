import React from "react";
import { Pagination, Table, Tag } from "antd";

// Sample store data
const storesData = [
    {
        id: 1,
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg",
        vendor: "Dell Technologies",
        rating: 5,
        orders: 3,
        totalSpent: "$23987",
        lastOrder: "Dec 12, 12:56 PM"
    },
    {
        id: 2,
        logo: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Honda_logo.png",
        vendor: "Honda",
        rating: 3,
        orders: 5,
        totalSpent: "$1250",
        lastOrder: "Dec 09, 10:48 AM"
    },
    {
        id: 3,
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Xiaomi_logo.svg",
        vendor: "Xiaomi",
        rating: 3,
        orders: 6,
        totalSpent: "$36360",
        lastOrder: "Dec 03, 05:45 PM"
    },
    {
        id: 4,
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Huawei-Logo.png",
        vendor: "Huawei Shop BD",
        rating: 3,
        orders: 1,
        totalSpent: "$1799",
        lastOrder: "Nov 27, 06:20 PM"
    },
    {
        id: 5,
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Intel_logo_%282020%2C_dark_blue%29.svg/2560px-Intel_logo_%282020%2C_dark_blue%29.svg.png",
        vendor: "Intel",
        rating: 3,
        orders: 2,
        totalSpent: "$65",
        lastOrder: "Nov 21, 10:25 AM"
    },
];

// Function to render stars based on rating
const renderStars = (rating: number) => "⭐".repeat(rating);

// Table columns
const columns = [
    {
        title: "VENDOR",
        dataIndex: "vendor",
        key: "vendor",
        render: (text: string, record: any) => (
            <div style={{ display: "flex", alignItems: "center" }}>
                <img src={record.logo} alt={text} style={{ width: 40, height: 40, marginRight: 10 }} />
                <a href="#">{text}</a>
            </div>
        ),
    },
    { title: "STORE RATING", dataIndex: "rating", key: "rating", render: (rating: number) => renderStars(rating) },
    { title: "ORDERS", dataIndex: "orders", key: "orders", render: (orders: number) => <a href="#">{orders}</a> },
    { title: "TOTAL SPENT", dataIndex: "totalSpent", key: "totalSpent" },
    { title: "LAST ORDER", dataIndex: "lastOrder", key: "lastOrder" },
];

// FollowedStores component
const FollowedStores: React.FC = () => {
    return (
        <div className="bg-white p-3">
            <Table dataSource={storesData} columns={columns} rowKey="id" pagination={false} />
            <Pagination className="text-center mt-3" defaultCurrent={1} total={50} />
        </div>
    )
};

export default FollowedStores;

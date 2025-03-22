import React from "react";
import { Divider, Pagination, Table, Tag } from "antd";
import SectionPagination from "../../utils/SectionPagination";

// Sample review data
const reviewsData = [
    { id: 1, product: "Razer Kraken v3", rating: 5, review: "Great headset!", status: "CANCELLED", date: "Nov 24, 10:16 AM", color: "gray" },
    { id: 2, product: "PS5 DualSense", rating: 5, review: "Very comfortable.", status: "APPROVED", date: "Just now", color: "green" },
    { id: 3, product: "iPhone 13 Pro", rating: 4, review: "Delivered ahead of time.", status: "PENDING", date: "Dec 9, 2:28 PM", color: "orange" },
    { id: 4, product: "Fitbit Sense", rating: 4, review: "Great for fitness tracking.", status: "APPROVED", date: "Just now", color: "green" },
    { id: 5, product: "MacBook Pro 13", rating: 4, review: "Mac is solid as always.", status: "APPROVED", date: "Dec 4, 12:56 PM", color: "green" },
];

// Star rating render function
const renderStars = (rating: number) => "⭐".repeat(rating);

// Table columns
const columns = [
    { title: "PRODUCT", dataIndex: "product", key: "product" },
    { title: "RATING", dataIndex: "rating", key: "rating", render: (rating: number) => <span>{renderStars(rating)}</span> },
    { title: "REVIEW", dataIndex: "review", key: "review" },
    { title: "STATUS", dataIndex: "status", key: "status", render: (status: string, record: any) => <Tag color={record.color}>{status}</Tag> },
    { title: "DATE", dataIndex: "date", key: "date" },
];

// ReviewList component
const ReviewList: React.FC = () => {
    return (
        <div className="bg-white p-3">
            <Table dataSource={reviewsData} columns={columns} rowKey="id" pagination={false} />
            <Pagination className="text-center mt-3" defaultCurrent={1} total={50} />
        </div>
    );
};

export default ReviewList;

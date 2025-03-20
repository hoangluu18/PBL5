import React from "react";
import { Table, Tag, Rate } from "antd";

// Sample review data
const reviewsData = [
    {
        key: "1",
        product: "Razer Kraken v3 x Wired 7.1...",
        rating: 5,
        review: "It performs exactly as expected. There are three of these in the family.",
        status: "CANCELLED",
        statusColor: "gray",
        date: "Nov 24, 10:16 AM",
    },
    {
        key: "2",
        product: "PlayStation 5 DualSense Wireless...",
        rating: 5,
        review: "The controller is quite comfy for me. Despite its increased size, the controller still fits well in my hands.",
        status: "APPROVED",
        statusColor: "green",
        date: "Just now",
    },
    {
        key: "3",
        product: "iPhone 13 pro max-Pacific Blue...",
        rating: 4,
        review: "The order was delivered ahead of schedule. You should leave the packaging sealed with plastic.",
        status: "PENDING",
        statusColor: "orange",
        date: "Dec 9, 2:28 PM",
    },
    {
        key: "4",
        product: "Fitbit Sense Advanced Smartwatch...",
        rating: 4,
        review: "This Fitbit is fantastic! I was trying to be in better shape and needed some motivation, so I decided to treat myself to a new Fitbit.",
        status: "APPROVED",
        statusColor: "green",
        date: "Just now",
    },
    {
        key: "5",
        product: 'Apple MacBook Pro 13 inch-M1...',
        rating: 5,
        review: "It's a Mac, after all. Once you've gone Mac, there's no going back. My first Mac lasted over nine years, and this is my second.",
        status: "APPROVED",
        statusColor: "green",
        date: "Dec 4, 12:56 PM",
    },
    {
        key: "6",
        product: 'Apple iMac 24" 4K Retina Display M...',
        rating: 3,
        review: "Personally, I like the minimalist style, but I wouldn't choose it if I were searching for a computer that I would use frequently.",
        status: "APPROVED",
        statusColor: "green",
        date: "Nov 28, 7:28 PM",
    },
];

// Table columns
const columns = [
    { title: "PRODUCT", dataIndex: "product", key: "product", render: (text: string) => <a href="#">{text}</a> },
    { title: "RATING", dataIndex: "rating", key: "rating", render: (rating: number) => <Rate disabled defaultValue={rating} /> },
    { title: "REVIEW", dataIndex: "review", key: "review" },
    {
        title: "STATUS",
        dataIndex: "status",
        key: "status",
        render: (status: string, record: any) => <Tag color={record.statusColor}>{status}</Tag>,
    },
    { title: "DATE", dataIndex: "date", key: "date" },
];

const ReviewsList: React.FC = () => {
    return <Table dataSource={reviewsData} columns={columns} rowKey="key" pagination={{ pageSize: 6 }} />;
};

export default ReviewsList;

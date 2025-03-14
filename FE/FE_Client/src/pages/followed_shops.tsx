import React from 'react';
import { Typography, Breadcrumb } from 'antd';
import ShopList from '../components/ShopList';

const { Title, Text } = Typography;

// Dữ liệu cứng cho các shop
const shops = [
    {
        id: 1,
        name: "Dell Technologies",
        rating: 4.5,
        followers: 15000,
        image: "https://via.placeholder.com/150",
    },
    {
        id: 2,
        name: "Intel",
        rating: 4.7,
        followers: 12000,
        image: "https://via.placeholder.com/150",
    },
    {
        id: 3,
        name: "Honda",
        rating: 4.6,
        followers: 18000,
        image: "https://via.placeholder.com/150",
    },
    {
        id: 3,
        name: "Honda",
        rating: 4.6,
        followers: 18000,
        image: "https://via.placeholder.com/150",
    },
    {
        id: 3,
        name: "Honda",
        rating: 4.6,
        followers: 18000,
        image: "https://via.placeholder.com/150",
    },
    {
        id: 3,
        name: "Honda",
        rating: 4.6,
        followers: 18000,
        image: "https://via.placeholder.com/150",
    },
    {
        id: 3,
        name: "Honda",
        rating: 4.6,
        followers: 18000,
        image: "https://via.placeholder.com/150",
    },
    {
        id: 3,
        name: "Honda",
        rating: 4.6,
        followers: 18000,
        image: "https://via.placeholder.com/150",
    },
    {
        id: 3,
        name: "Honda",
        rating: 4.6,
        followers: 18000,
        image: "https://via.placeholder.com/150",
    },
    {
        id: 3,
        name: "Honda",
        rating: 4.6,
        followers: 18000,
        image: "https://via.placeholder.com/150",
    },
    // Thêm các shop khác tương tự
];

const FollowedShops: React.FC = () => {
    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Breadcrumb style={{ marginBottom: '20px' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>My Favourite Stores</Breadcrumb.Item>
            </Breadcrumb>
            <Title level={2}>My Favourite Stores</Title>
            <Text>Essential for a better life</Text>
            <ShopList shops={shops} />
        </div>
    );
};

export default FollowedShops;
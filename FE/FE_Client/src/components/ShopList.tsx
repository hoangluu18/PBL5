import React from 'react';
import { Row, Col } from 'antd';
import ShopCard from './ShopCard';

interface Shop {
    id: number;
    name: string;
    rating: number;
    followers: number;
    image: string;
}

interface ShopListProps {
    shops: Shop[];
}

const ShopList: React.FC<ShopListProps> = ({ shops }) => {
    return (
        <Row gutter={[16, 16]}>
            {shops.map(shop => (
                <Col xs={24} sm={12} md={8} lg={6} key={shop.id}>
                    <ShopCard shop={shop} />
                </Col>
            ))}
        </Row>
    );
};

export default ShopList;
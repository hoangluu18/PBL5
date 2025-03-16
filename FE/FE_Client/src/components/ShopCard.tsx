import React from 'react';
import { Card, Avatar, Rate, Typography } from 'antd';
import { StarFilled } from '@ant-design/icons';

const { Text } = Typography;

interface ShopCardProps {
    shop: {
        id: number;
        name: string;
        rating: number;
        followers: number;
        image: string;
    };
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
    return (
        <Card
            hoverable
            style={{ width: '100%', textAlign: 'center' }}
        >
            <Avatar src={shop.image} size={64} style={{ marginBottom: '10px' }} />
            <Card.Meta
                title={shop.name}
                description={
                    <>
                        <Rate disabled defaultValue={shop.rating} character={<StarFilled />} style={{ fontSize: '14px' }} />
                        <div>
                            <Text type="secondary">{shop.followers.toLocaleString()} followers</Text>
                        </div>
                    </>
                }
            />
        </Card>
    );
};

export default ShopCard;
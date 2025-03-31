import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Card, Col, Row, Typography, Spin } from "antd";
import ICategory from "../models/dto/Category";
import CategoryService from "../services/category.service";

const { Text } = Typography;

const CategorySection = () => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryService = new CategoryService();
                const data = await categoryService.getRootCategories();
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '24px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px 0' }}>
            <Row gutter={[5, 5]}>
                {categories.map((category) => (
                    <Col xs={12} sm={8} md={6} lg={4} xl={3} key={category.id}>
                        <Link to={`/c/${category.alias}`}>
                            <Card
                                hoverable
                                cover={
                                    <Avatar
                                        size={80}
                                        src={`src/assets/category-images/${category.image}`}
                                        style={{
                                            margin: '16px auto',
                                            display: 'block',
                                            backgroundColor: '#f5f5f5'
                                        }}
                                    />
                                }
                                bodyStyle={{ padding: '0 10px 16px', textAlign: 'center' }}
                            >
                                <Text strong style={{ fontSize: '16px' }}>
                                    {category.name}
                                </Text>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </div >
    );
};

export default CategorySection;
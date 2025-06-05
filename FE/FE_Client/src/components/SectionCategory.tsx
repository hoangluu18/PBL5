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
                const data = await categoryService.getAllCategories();
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
            <Row gutter={[16, 16]}>
                {categories.map((category) => (
                    <Col xs={12} sm={8} md={6} lg={4} xl={3} key={category.id}>
                        <Link to={`/c/${category.alias}`} style={{ textDecoration: 'none' }}>
                            <Card
                                hoverable
                                style={{
                                    height: '200px', // Fixed height cho tất cả card
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                                bodyStyle={{
                                    padding: '16px 10px',
                                    textAlign: 'center',
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                            >
                                {/* Container cho avatar với fixed height */}
                                <div style={{
                                    height: '120px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '12px'
                                }}>
                                    <Avatar
                                        size={80}
                                        src={category.image}
                                        style={{
                                            backgroundColor: '#f5f5f5',
                                            objectFit: 'cover' // Đảm bảo hình ảnh không bị méo
                                        }}
                                    />
                                </div>
                                {/* Text container với fixed height */}
                                <div style={{
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text
                                        strong
                                        style={{
                                            fontSize: '14px',
                                            textAlign: 'center',
                                            lineHeight: '1.2',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical'
                                        }}
                                    >
                                        {category.name}
                                    </Text>
                                </div>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default CategorySection;
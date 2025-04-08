import { useEffect, useState } from "react";
import { LikeOutlined, StarFilled } from "@ant-design/icons";
import { Button, Rate, Tooltip, Typography, Empty } from "antd";
import ProfileService from "../services/profile.service";
import { IProfileReviewDto } from "../models/dto/ProfileReviewDto";
import { extractDate } from "../utils/DateUtil";

const { Text, Title } = Typography;

interface ProfileReviewProps {
    id: number;
}

const ProfileReview: React.FC<ProfileReviewProps> = ({ id }) => {
    const [reviews, setReviews] = useState<IProfileReviewDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, [id]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const profileService = new ProfileService();
            const data = await profileService.getReviewsByCustomerId(id);
            setReviews(data);
        } catch (error) {
            console.error("Failed to fetch customer reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reviews-container" style={{ 
            background: "white",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
            <Title level={4} style={{ 
                marginBottom: 20,
                borderBottom: "1px solid #f0f0f0",
                paddingBottom: "16px",
                display: "flex",
                alignItems: "center"
            }}>
                <StarFilled style={{ marginRight: 8, color: "#fadb14" }} />
                Đánh giá của bạn
            </Title>

            {reviews.length > 0 ? (
                <div className="reviews-list">
                    {reviews.map((review, index) => (
                        <div key={review.id} className="review-item" style={{
                            padding: "20px 0",
                            borderBottom: index < reviews.length - 1 ? "1px solid #f0f0f0" : "none"
                        }}>
                            <div style={{ marginBottom: 12 }}>
                                <Text strong style={{ fontSize: "16px", marginBottom: 8, display: "block" }}>
                                    {review.productName}
                                </Text>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <Rate 
                                        value={review.rating} 
                                        disabled 
                                        allowHalf 
                                        style={{ fontSize: "14px" }}
                                    />
                                    <Text type="secondary">
                                        {extractDate(review.createdAt)}
                                    </Text>
                                </div>
                            </div>

                            <Text style={{ 
                                display: "block", 
                                margin: "12px 0",
                                fontSize: "15px",
                                lineHeight: "1.6"
                            }}>
                                {review.content}
                            </Text>

                            {review.feedback && (
                                <div style={{
                                    background: "#f5f5f5",
                                    padding: "12px 16px",
                                    borderRadius: "6px",
                                    marginTop: "12px"
                                }}>
                                    <Text type="secondary" style={{ fontSize: "14px" }}>
                                        <Text strong type="secondary">Phản hồi từ shop: </Text>
                                        {review.feedback}
                                    </Text>
                                </div>
                            )}

                            <div style={{ marginTop: 16 }}>
                                <Button 
                                    type="text"
                                    icon={<LikeOutlined />}
                                    style={{ 
                                        color: "#595959",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "4px 12px"
                                    }}
                                >
                                    <Text type="secondary" style={{ marginLeft: 4 }}>
                                        Hữu ích ({review.likes})
                                    </Text>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <Text style={{ fontSize: "16px", color: "#666" }}>
                            Bạn chưa có đánh giá nào
                        </Text>
                    }
                    style={{ margin: "40px 0" }}
                />
            )}

            <style>{`
                .reviews-container {
                    transition: all 0.3s ease;
                }
                .reviews-container:hover {
                    box-shadow: 0 3px 6px rgba(0,0,0,0.15);
                }
                .review-item {
                    transition: background-color 0.3s ease;
                }
                .review-item:hover {
                    background-color: #fafafa;
                }
                .ant-rate-star:not(:last-child) {
                    margin-right: 4px;
                }
            `}</style>
        </div>
    );
};

export default ProfileReview;
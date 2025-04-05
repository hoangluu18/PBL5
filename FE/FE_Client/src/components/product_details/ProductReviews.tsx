import { useEffect, useState } from "react";
import { LikeOutlined, StarFilled, MessageOutlined, LikeFilled } from "@ant-design/icons";
import { Avatar, Button, Rate, Badge, Progress, Tooltip } from "antd";
import { IReviewDto } from "../../models/dto/ReviewDto";
import ReviewService from "../../services/review.service";
import { extractDate } from "../../utils/DateUtil";

interface ProductReviewsTabProps {
    id: number;
}

const ProductReviews: React.FC<ProductReviewsTabProps> = ({ id }) => {

    const [activeFilter, setActiveFilter] = useState("all");
    const [reviews, setReviews] = useState<IReviewDto[]>([]);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const productService = new ReviewService();

            const data = await productService.getReviews(id);
            if (data.length > 0) {
                setReviews(data);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };
    const reviewLength = reviews.length;

    const count5Star = reviews.filter((review) => review.rating === 5).length;
    const count4Star = reviews.filter((review) => review.rating === 4).length;
    const count3Star = reviews.filter((review) => review.rating === 3).length;
    const count2Star = reviews.filter((review) => review.rating === 2).length;
    const count1Star = reviews.filter((review) => review.rating === 1).length;

    // Rating statistics
    const stats = {
        average: reviewLength > 0 ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviewLength).toFixed(1) : "0.0",
        total: reviewLength,
        distribution: [
            { stars: 5, count: count5Star, percentage: reviewLength > 0 ? (count5Star / reviewLength) * 100 : 0 },
            { stars: 4, count: count4Star, percentage: reviewLength > 0 ? (count4Star / reviewLength) * 100 : 0 },
            { stars: 3, count: count3Star, percentage: reviewLength > 0 ? (count3Star / reviewLength) * 100 : 0 },
            { stars: 2, count: count2Star, percentage: reviewLength > 0 ? (count2Star / reviewLength) * 100 : 0 },
            { stars: 1, count: count1Star, percentage: reviewLength > 0 ? (count1Star / reviewLength) * 100 : 0 },
        ],
    };

    const filters = [
        { key: "all", label: "Tất cả" },
        { key: "5star", label: `5 Sao (${count5Star})` },
        { key: "4star", label: `4 Sao (${count4Star})` },
        { key: "3star", label: `3 Sao (${count3Star})` },
        { key: "2star", label: `2 Sao (${count2Star})` },
        { key: "1star", label: `1 Sao (${count1Star})` },
    ];

    const clickLikeBtn = async (reviewId: number) => {
        try {
            // Optimistically update the state
            setReviews((prevReviews) =>
                prevReviews.map((review) =>
                    review.id === reviewId
                        ? {
                            ...review,
                            votedByCurrentCustomer: !review.votedByCurrentCustomer, // Toggle the vote
                            likes: review.votedByCurrentCustomer ? review.likes - 1 : review.likes + 1, // Adjust likes count
                        }
                        : review
                )
            );

            // Call the API to update the vote
            const reviewService = new ReviewService();
            await reviewService.voteReview(reviewId, 5);

            // Optionally, you can refetch the review data here if needed
        } catch (error) {
            console.error("Failed to update vote:", error);

            // Revert the state if the API call fails
            setReviews((prevReviews) =>
                prevReviews.map((review) =>
                    review.id === reviewId
                        ? {
                            ...review,
                            votedByCurrentCustomer: !review.votedByCurrentCustomer, // Revert the vote
                            likes: review.votedByCurrentCustomer ? review.likes + 1 : review.likes - 1, // Revert likes count
                        }
                        : review
                )
            );
        }
    };

    return (
        <div>
            {/* Đánh giá tổng quan */}
            <div className="bg-white border p-4 shadow-sm">
                <h4 className="mb-4 fw-bold">Đánh giá sản phẩm</h4>

                <div className="row g-4">
                    <div className="col-md-4 border-end">
                        <div className="text-center">
                            <div className="d-flex align-items-center justify-content-center">
                                <h1 className="mb-0 me-2 fw-bold">{stats.average}</h1>
                                <div className="d-flex flex-column align-items-start">
                                    <Rate value={parseFloat(stats.average)} disabled allowHalf style={{ fontSize: "16px", color: "#f8c51c" }} />
                                    <small className="text-muted">{stats.total} đánh giá</small>
                                </div>
                            </div>

                            <div className="mt-4">
                                {stats.distribution.map((item) => (
                                    <div className="d-flex align-items-center my-1" key={item.stars}>
                                        <div style={{ width: "50px" }} className="text-end pe-2">
                                            {item.stars} <StarFilled style={{ color: "#f8c51c", fontSize: "12px" }} />
                                        </div>
                                        <Progress
                                            percent={item.percentage}
                                            showInfo={false}
                                            size="small"
                                            strokeColor="#f8c51c"
                                            style={{ width: "70%" }}
                                        />
                                        <div style={{ width: "40px" }} className="ps-2 text-muted">
                                            {item.count}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="mb-3">
                            <div className="d-flex flex-wrap">
                                {filters.map((filter) => (
                                    <Button
                                        key={filter.key}
                                        type={activeFilter === filter.key ? "primary" : "default"}
                                        size="middle"
                                        className="me-2 mb-2"
                                        style={{
                                            borderRadius: "20px",
                                            background: activeFilter === filter.key ? "#1890ff" : "#f5f5f5",
                                            borderColor: activeFilter === filter.key ? "#1890ff" : "#f5f5f5",
                                        }}
                                        onClick={() => setActiveFilter(filter.key)}
                                    >
                                        {filter.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <span className="text-muted">Hiển thị {reviewLength} trong tổng số {stats.total} đánh giá</span>
                            </div>
                            <div>
                                <Button type="primary" className="rounded-pill">Viết đánh giá</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách đánh giá */}
            <div className="mt-4 bg-white border rounded-3 p-4 shadow-sm">
                <h5 className="mb-4 fw-bold">Đánh giá của khách hàng</h5>

                {reviewLength > 0 ? reviews.map((review, index) => (
                    <div key={index}>
                        <div className="py-4">
                            <div className="d-flex">
                                <div className="me-3">
                                    <Badge dot={review.rating >= 4.5} color="#52c41a">
                                        <Avatar src={review.customerPhoto} size={48} className="border" />
                                    </Badge>
                                </div>

                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 className="mb-1 fw-bold">{review.customerName}</h6>
                                            <div className="d-flex align-items-center">
                                                <Rate
                                                    value={review.rating}
                                                    disabled
                                                    allowHalf
                                                    style={{ fontSize: "14px", color: "#f8c51c" }}
                                                />
                                                <span className="ms-2 text-muted">{review.rating}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-muted mt-1 small">
                                        <span>{extractDate(review.created_at)}</span>
                                        <span className="mx-2">|</span>
                                        <span>Phân loại: </span>
                                    </div>

                                    <p className="mt-3">{review.content}</p>

                                    {/* {review.hasImage && (
                                        <div className="d-flex mt-2 mb-3">
                                            {[1, 2, 3].map((img) => (
                                                <div key={img} className="me-2 position-relative" style={{ width: "80px", height: "80px" }}>
                                                    <img
                                                        src={`/src/assets/shop-images/product-image-${img}.jpg`}
                                                        className="rounded img-fluid object-fit-cover"
                                                        style={{ width: "100%", height: "100%" }}
                                                        alt="Product review"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )} */}

                                    <div className="mt-3 d-flex">
                                        <Tooltip title="Đánh giá hữu ích">
                                            <Button
                                                type="text"
                                                className={`d-flex align-items-center me-3 p-1 ${review.votedByCurrentCustomer ? "text-primary" : "text-muted"
                                                    }`}
                                                icon={
                                                    review.votedByCurrentCustomer ? (
                                                        <LikeFilled className="me-1" color="blue" />

                                                    ) : (
                                                        <LikeOutlined className="me-1" />
                                                    )
                                                }
                                            >
                                                <span onClick={() => clickLikeBtn(review.id)}>Hữu ích ({review.likes})</span>
                                            </Button>
                                        </Tooltip>

                                        <Tooltip title="Bình luận">
                                            <Button
                                                type="text"
                                                className="d-flex align-items-center text-muted p-1"
                                                icon={<MessageOutlined className="me-1" />}
                                            >
                                                <span>Bình luận</span>
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thêm đường ngăn cách hr giữa các đánh giá, trừ đánh giá cuối cùng */}
                        {
                            index < reviews.length - 1 && (
                                <hr className="my-0" style={{ backgroundColor: "#f0f0f0", height: "1px", border: "none" }} />
                            )
                        }
                    </div>
                )) : (
                    <div className="text-center my-4">
                        <span className="fs-5">📝 Chưa có đánh giá nào cho sản phẩm này</span>
                    </div>
                )}

                {reviewLength > 0 &&
                    <div className="text-center mt-4">
                        <Button type="primary" ghost className="px-4">Xem thêm đánh giá</Button>
                    </div>
                }
            </div>
        </div >
    );
};

export default ProductReviews;
import { List, Rate, Avatar, Button } from "antd";
import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";

const reviews = [
    {
        id: 1,
        name: "Zingko Kudobum",
        avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel", // Random avatar
        rating: 5,
        time: "35 mins ago",
        comment: "100% satisfied",
        images: [
            "/images/review1.jpg",
            "/images/review2.jpg",
            "/images/review3.jpg",
        ],
        response: "Thank you for your valuable feedback",
    },
    {
        id: 2,
        name: "Piere Auguste Renoir",
        avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
        rating: 4,
        time: "23 Oct, 12:09 PM",
        comment:
            "Since the spring loaded event, I've been wanting an iMac, and it's exceeded my expectations. The screen is clear, the colors are vibrant (I got the blue one!), and the performance is more than adequate for my needs as a college student. That's how good it is.",
        images: ['https://prium.github.io/phoenix/v1.19.0/assets/img/e-commerce/review-11.jpg', 'https://prium.github.io/phoenix/v1.19.0/assets/img/e-commerce/review-12.jpg'],
        response: null,
    },
    {
        id: 3,
        name: "Abel Kablmann",
        avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
        rating: 3,
        time: "21 Oct, 12:00 PM",
        comment:
            "Over the years, I've preferred Apple products. My job has allowed me to use Windows products on laptops and PCs. I've owned Windows laptops and desktops for home use in the past and will never...",
        images: [],
        response: null,
    },
];

const ReviewList = () => {
    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div style={{ maxWidth: 1000 }}>
            <div className="d-flex fs-3 gap-4">
                <div>
                    <span>{avgRating}</span>/5
                    <Rate disabled allowHalf defaultValue={Number(avgRating)} className="customize-star-spacing"
                        style={{ fontSize: 15 }} />
                </div>
                <div>
                    6548 ratings and 567 reviews
                    <Button type="primary" style={{ marginLeft: 10 }}>Rate this product</Button>
                </div>
            </div>

            <List
                itemLayout="vertical"
                dataSource={reviews}
                renderItem={(review) => (
                    <List.Item key={review.id}
                        actions={[
                            <span><StarOutlined /> 156</span>,
                            <span><LikeOutlined /> 156</span>,
                            <span><MessageOutlined /> 2</span>,
                        ]}>

                        <List.Item.Meta
                            avatar={<Avatar src={review.avatar} />}
                            title={
                                <div>
                                    <p className="p-0 m-0">by {review.name}</p>
                                    <div><Rate disabled allowHalf defaultValue={review.rating} className="customize-star-spacing"
                                        style={{ fontSize: 15 }} /></div>
                                    <small className="fw-light">{review.time}</small>
                                </div>
                            }
                        />
                        <p>{review.comment}</p>

                        {review.images.length > 0 && (
                            <div style={{ display: "flex", gap: "10px" }}>
                                {review.images.map((img, index) => (
                                    <img key={index} src={img} alt="review" style={{ width: 100, borderRadius: 5 }} />
                                ))}
                            </div>
                        )}

                        {review.response && (
                            <div style={{ marginTop: 10, padding: 10, background: "#f5f5f5", borderRadius: 5 }}>
                                <MessageOutlined /> <strong>Respond from store</strong> <span style={{ fontSize: "12px" }}>5 mins ago</span>
                                <p>{review.response}</p>
                            </div>
                        )}

                    </List.Item>
                )}
            />
        </div>
    );
};

export default ReviewList;

import { Rate, Badge } from "antd";
import { Link } from "react-router-dom";
import CurrencyFormat from "../utils/CurrencyFormat";

interface IProduct {
    image: string;
    title: string;
    price: number;
    discount: number;
    rating: number;
    sold: number;
}

const ProductCard = ({ image, title, price, discount, rating, sold }: IProduct) => {
    const discountedPrice = price - (price * discount) / 100;

    return (
        <div className="position-relative product-card" style={{ width: "180px" }}>
            <div className="card border-0 shadow-sm rounded overflow-hidden p-2">
                <Link to="/" className="text-decoration-none">
                    <div className="d-flex flex-column justify-content-between">
                        <div className="position-relative w-100 h-100">
                            <div style={{ height: "170px" }}>
                                <img
                                    src={image}
                                    alt={title}
                                    className="h-100 w-100 product-image"
                                    style={{ borderRadius: "10px 10px 0 0" }}
                                />
                            </div>
                        </div>
                        <div className="py-2">
                            <p className="mb-2 product-title line-clamp-2"
                                style={{ fontSize: "14px", height: "40px" }}>
                                {title}
                            </p>
                            <div className="d-flex align-items-center mb-1">
                                <Rate value={rating} disabled allowHalf className="customize-star-spacing"
                                    style={{ fontSize: "12px", color: "#fadb14" }} />
                                <small className="text-muted ms-2">({sold} đã bán)</small>
                            </div>
                            <div style={{ height: "30px" }} className="mb-2">
                                <div className="text-danger fw-bold" style={{ fontSize: "16px" }}>
                                    <CurrencyFormat price={discountedPrice} />
                                </div>
                                {discount > 0 && (
                                    <div>
                                        <Badge count={`-${discount}%`} color="#ccc" />
                                        <del className="ms-2 text-muted" style={{ fontSize: "12px" }}>
                                            <CurrencyFormat price={price} />
                                        </del>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;

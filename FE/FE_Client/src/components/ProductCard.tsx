import { Rate, Badge } from "antd";
import logo from '../assets/logo.jpg'
import { Link } from "react-router-dom";
import CurrencyFormat from "../utils/CurrencyFormat";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useState } from "react";



interface IProduct {
    image: string;
    title: string;
    price: number;
    discount: number;
    rating: number;
    sold: number;
}

const ProductCard = ({ image, title, price, discount, rating, sold }: IProduct) => {

    const [isHovered, setIsHovered] = useState<boolean>(false);

    return (
        <div className="position-relative product-card">
            {discount > 0 && (
                <Badge.Ribbon text={`-${discount}%`} color="red" style={{ zIndex: 2, insetInlineEnd: -9 }} />
            )}
            <Badge
                offset={[-175, 25]}
                count={
                    <Link
                        to={"/fad"}
                        className="p-2 border-primary border rounded-circle favorite"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {isHovered ? (
                            <HeartFilled style={{ fontSize: "15px" }} />
                        ) : (
                            <HeartOutlined className="text-primary" style={{ fontSize: "15px" }} />
                        )}
                    </Link>
                }
            >
                <div className="card border-0 shadow-sm rounded overflow-hidden">
                    <Link to={"/"}>
                        <div className="position-relative">
                            <img
                                src={logo}
                                alt={title}
                                className="img-fluid w-100 product-image"
                                style={{ height: "220px", objectFit: "cover", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
                            />
                        </div>
                        <div className="p-3">
                            <h6 className="mb-2 product-title line-clamp-2"
                                style={{ fontSize: "16px", minHeight: "40px" }}>{title}</h6>
                            <div className="d-flex align-items-center mb-2">
                                <Rate value={rating} disabled allowHalf={false} style={{ fontSize: "14px", color: "#fadb14" }} />
                                <small className="text-muted ms-2">({sold} sold)</small>
                            </div>
                            <div className="d-flex align-items-center">
                                <span className="text-danger fw-bold" style={{ fontSize: "18px" }}>
                                    <CurrencyFormat price={price} discount={discount} />
                                </span>
                                {discount > 0 && (
                                    <del className="ms-2 text-muted" style={{ fontSize: "14px" }}>
                                        <CurrencyFormat price={price} discount={discount} />
                                    </del>
                                )}
                            </div>
                        </div>
                    </Link>
                </div>
            </Badge>
        </div >
    );
};

export default ProductCard;

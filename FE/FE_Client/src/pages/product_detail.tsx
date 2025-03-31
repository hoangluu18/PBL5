import { Breadcrumb, Button, Col, Rate, Row, Space, Tabs, TabsProps, Typography } from "antd";
import CurrencyFormat from "../utils/CurrencyFormat";
import { useEffect, useState } from "react";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import ProductDescriptionTab from "../components/product_details/ProductDescriptionTab";
import ProductDetailTab from "../components/product_details/ProductDetailTab";
import ReviewList from "../components/product_details/ReviewList";
import ShopInfo from "../components/product_details/ShopInfo";
import { useParams } from "react-router";
import ProductService from "../services/product.service";
import { IProductFullInfoDto } from "../models/dto/ProductFullInfoDto";
import { Link } from "react-router-dom";
import "../css/style.css";
const { Text } = Typography;

const ProductDetailPage: React.FC = () => {
    const [product, setProduct] = useState<IProductFullInfoDto>({} as IProductFullInfoDto);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);

    const { alias } = useParams();

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        try {
            const productService = new ProductService();
            if (alias) {
                const data = await productService.getProductByAlias(alias);
                setProduct(data);
                setSelectedImage(`http://localhost:5173/src/assets/product-images/${data.mainImage}`); // Gán ảnh chính ban đầu
            } else {
                console.error("Alias is undefined");
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    const discountedPrice = product.price - (product.price * product.discountPercent) / 100;

    const items: TabsProps["items"] = [
        {
            key: "description",
            label: "Description",
            children: product.fullDescription ? (
                <ProductDescriptionTab description={product.fullDescription} />
            ) : (
                <Text type="secondary">No description available</Text>
            ),
        },
        {
            key: "detail",
            label: "Detail",
            children: product.id ? (
                <ProductDetailTab id={product.id} />
            ) : (
                <Text type="secondary">No detail available</Text>
            ),
        },
        {
            key: "ratingAndReview",
            label: "Ratings & Reviews",
            children: <ReviewList />,
        },
    ];

    const onChange = (key: string) => {
        // console.log(key);
    };

    return (
        <div className="container mt-3">
            <Breadcrumb
                items={[
                    { key: "home", title: <Link to="/">Home</Link> },
                    ...(product.breadCrumbs?.map((breadCrumb) => ({
                        key: breadCrumb.alias,
                        title: <Link to={`/c/${breadCrumb.alias}`}>{breadCrumb.name}</Link>,
                    })) || []),
                ]}
            />
            <Row className="mt-3 p-3" style={{ backgroundColor: "white" }}>
                {/* Hình ảnh nhỏ */}
                <Col span={2}>
                    <div className="d-flex flex-column g-2">
                        {product.images &&
                            product.images.map((image, index) => (
                                <div key={index} className="m-2 ms-0">
                                    <img
                                        src={`http://localhost:5173/src/assets/product-extra-images/${image}`}
                                        className={`border p-1 rounded ${selectedImage.includes(image) ? "border-danger" : "border-secondary"}`}
                                        style={{ height: "80px", cursor: "pointer" }}
                                        onMouseEnter={() => setSelectedImage(`http://localhost:5173/src/assets/product-extra-images/${image}`)} // Cập nhật ảnh chính khi hover
                                    />
                                </div>
                            ))}
                    </div>
                </Col>

                {/* Ảnh chính */}
                <Col span={8}>
                    <div className="m-2">
                        <img
                            src={`${selectedImage}`}
                            className="border border-secondary p-2 rounded w-100"
                        />
                    </div>
                </Col>

                {/* Thông tin sản phẩm */}
                <Col span={13} className="mt-2 ms-3 d-flex flex-column justify-content-between">
                    <div>
                        <Rate
                            value={product.averageRating}
                            disabled
                            allowHalf
                            className="customize-star-spacing"
                            style={{ fontSize: "17px", color: "#fadb14" }}
                        />
                        &nbsp;&nbsp;&nbsp;
                        <span className="text-primary fs-6">{product.reviewCount} People rated and reviewed</span>
                    </div>
                    <div>
                        <h2>{product.name}</h2>
                    </div>
                    <div>
                        <div className="text-danger fw-bold" style={{ fontSize: "36px" }}>
                            <CurrencyFormat price={discountedPrice} />
                            &nbsp;&nbsp;
                            {product.discountPercent > 0 && (
                                <>
                                    <del className="ms-2 text-muted fw-light" style={{ fontSize: "30px" }}>
                                        <CurrencyFormat price={product.price} />
                                    </del>
                                    &nbsp;&nbsp;
                                    <span className="text-warning fs-4">{product.discountPercent}% off</span>
                                </>
                            )}
                        </div>
                    </div>
                    {product.inStock ? (
                        <div className="text-success fs-5">In Stock</div>
                    ) : (
                        <div className="text-danger fs-5">Out of Stock</div>
                    )}
                    <div>&nbsp;</div>
                    <div>
                        {product.variantMap &&
                            Object.entries(product.variantMap).map(([key, value]) => (
                                <div key={key}>
                                    <p className="fs-5 pb-0 mb-0">{key}:</p>
                                    <div className="d-flex">
                                        {value.map((val, index) => (
                                            <div key={index}
                                                style={{ cursor: "pointer" }}
                                                className={`m-1 d-flex align-items-center border
                                                ${selectedImage.includes(val.photo) ? "border-danger" : "border-secondary"} px-2 py-1`}>
                                                {val.photo && (
                                                    <div>
                                                        <img
                                                            src={`http://localhost:5173/src/assets/product-variants-images/${val.photo}`}
                                                            height={30}
                                                            onMouseEnter={() => {
                                                                // Cập nhật ảnh chính khi hover
                                                                setSelectedImage(`http://localhost:5173/src/assets/product-variants-images/${val.photo}`)

                                                                // Cập nhật số lượng khi hover
                                                                setAmount(val.quantity)
                                                            }}

                                                        />
                                                        &nbsp;&nbsp;
                                                    </div>
                                                )}
                                                <div>{val.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="mt-2">
                        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
                            {/* Chọn Số Lượng */}
                            <div>
                                <Text strong>Quantity :</Text>
                                &nbsp;&nbsp;
                                <Space>
                                    <Button icon={<MinusOutlined />} onClick={() => setQuantity((q) => Math.max(1, q - 1))} />
                                    <Text>{quantity}</Text>
                                    <Button icon={<PlusOutlined />} onClick={() => setQuantity((q) => q + 1)} />
                                </Space>
                            </div>
                            {
                                amount > 0 && <div>
                                    <Text strong>Available :</Text>
                                    &nbsp;&nbsp;
                                    <Text>{amount} sản phẩm</Text>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="mt-3">
                        <Button type="primary" className="p-3" size="large">
                            Thêm vào giỏ hàng
                        </Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button type="primary" danger className="p-3" size="large">
                            Mua ngay
                        </Button>
                    </div>
                </Col>
            </Row>

            <Row className="mt-3 ">
                <ShopInfo {...product.shopDto} />
            </Row>

            <Row className="mt-3">
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} className="w-100" />
            </Row>
        </div>
    );
};

export default ProductDetailPage;

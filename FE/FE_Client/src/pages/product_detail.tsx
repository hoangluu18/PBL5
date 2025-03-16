import { Breadcrumb, Button, Col, Rate, Row, Select, Space, Tabs, TabsProps, Typography } from "antd";
import CurrencyFormat from "../utils/CurrencyFormat";
import { useState } from "react";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import ProductDescriptionTab from "../components/product_details/ProductDescriptionTab";
import ProductDetailTab from "../components/product_details/ProductDetailTab";
import ReviewList from "../components/product_details/ReviewList";

const { Text } = Typography;

const ProductDetailPage: React.FC = () => {

    const product = {
        image: "data:image/jpeg;base64,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",
        title: `24" iMac® with Retina 4.5K display - Apple M1 8GB Memory - 256GB SSD - w/Touch ID (Latest Model) - Blue`,
        price: 79000,
        discount: 66,
        rating: 4.9,
        sold: 95.4,
    }

    const discountedPrice = product.price - (product.price * product.discount) / 100;

    const [size, setSize] = useState<number>(44);
    const [quantity, setQuantity] = useState<number>(1);

    const sizes = [38, 39, 40, 41, 42, 43, 44, 45];

    const items: TabsProps['items'] = [
        {
            key: 'description',
            label: 'Description',
            children: <ProductDescriptionTab />,
        },
        {
            key: 'detail',
            label: 'Detail',
            children: <ProductDetailTab />,
        },
        {
            key: 'ratingAndReview',
            label: 'Ratings & Reviews',
            children: <ReviewList />,
        },
    ];


    const onChange = (key: string) => {
        console.log(key);
    };

    return (
        <div className="container mt-3">
            <Breadcrumb
                items={[
                    {
                        title: 'Home',
                    },
                    {
                        title: <a href="">Application Center</a>,
                    },
                    {
                        title: <a href="">Application List</a>,
                    },
                    {
                        title: 'An Application',
                    },
                ]}
            />
            <Row className="mt-3" gutter={10}>
                <Col span={2}>
                    <div className="d-flex flex-column g-2">
                        <div className="m-2 ms-0">
                            <img src="https://prium.github.io/phoenix/v1.19.0/assets/img/products/details/blue_front.png"
                                className="border border-secondary p-1 rounded" style={{ height: "80px" }} />
                        </div>
                        <div className="m-2 ms-0">
                            <img src="https://prium.github.io/phoenix/v1.19.0/assets/img/products/details/blue_front.png"
                                className="border border-secondary p-1 rounded" style={{ height: "80px" }} />
                        </div>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="m-2">
                        <img src="https://prium.github.io/phoenix/v1.19.0/assets/img/products/details/blue_front.png"
                            className="border border-secondary p-2 rounded w-100" />
                    </div>
                </Col>
                <Col span={14} className="mt-2">
                    <div>
                        <Rate value={4} disabled allowHalf className="customize-star-spacing"
                            style={{ fontSize: "17px", color: "#fadb14" }} />
                        &nbsp;&nbsp;&nbsp;
                        <span className="text-primary fs-6">6548 People rated and reviewed</span>
                    </div>
                    <div>
                        <h2>{product.title}</h2>
                    </div>
                    <div>
                        <div className="text-danger fw-bold" style={{ fontSize: "36px" }}>
                            <CurrencyFormat price={discountedPrice} />
                            &nbsp;&nbsp;
                            {product.discount > 0 && (
                                <>
                                    <del className="ms-2 text-muted fw-light" style={{ fontSize: "30px" }}>
                                        <CurrencyFormat price={product.price} />
                                    </del>
                                    &nbsp;&nbsp;
                                    <span className="text-warning fs-4">{product.discount}% off</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="text-success fs-4">
                        In stock
                    </div>
                    <div>
                        Do you want it on Saturday, July 29th? Choose Saturday Delivery at checkout if you want your order delivered within 12 hours 43 minutes, Details. Gift wrapping is available.
                    </div>
                    <div>
                        <p className="fs-5 pb-0 mb-0">Color: <span>blue</span></p>
                        <div className="d-flex ">
                            <div className="m-1">
                                <img src="https://prium.github.io/phoenix/v1.19.0/assets/img/products/details/blue_front.png"
                                    height={"50px"} className="border border-secondary p-1" />
                            </div>
                            <div className="m-1">
                                <img src="https://prium.github.io/phoenix/v1.19.0/assets/img/products/details/blue_back.png"
                                    height={"50px"} className="border border-secondary p-1" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-2">
                        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
                            {/* Chọn Size */}
                            <div>
                                <Text strong>Size :</Text>
                                &nbsp;&nbsp;
                                <Space>
                                    <Select
                                        value={size}
                                        onChange={setSize}
                                        style={{ width: 70 }}
                                        options={sizes.map((size) => ({ value: size, label: size }))}
                                    />
                                </Space>
                            </div>

                            {/* Chọn Số Lượng */}
                            <div>
                                <Text strong>Quantity :</Text>
                                &nbsp;&nbsp;
                                <Space>
                                    <Button
                                        icon={<MinusOutlined />}
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    />
                                    <Text>{quantity}</Text>
                                    <Button
                                        icon={<PlusOutlined />}
                                        onClick={() => setQuantity((q) => q + 1)}
                                    />
                                </Space>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <div className="mt-3">
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </div>
        </div>
    );
};

export default ProductDetailPage;

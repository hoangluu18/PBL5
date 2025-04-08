import { Breadcrumb, Button, Col, Rate, Row, Tabs, TabsProps, Typography, Divider, Tag, Badge, Tooltip, Image, Spin, notification } from "antd";
import CurrencyFormat from "../utils/CurrencyFormat";
import { useContext, useEffect, useRef, useState } from "react";
import { MinusOutlined, PlusOutlined, ShoppingCartOutlined, ThunderboltOutlined, HeartOutlined, ShareAltOutlined } from "@ant-design/icons";
import ProductDescriptionTab from "../components/product_details/ProductDescriptionTab";
import ProductDetailTab from "../components/product_details/ProductDetailTab";
import ReviewList from "../components/product_details/ProductReviews";
import ShopInfo from "../components/product_details/ShopInfo";
import { useParams } from "react-router";
import ProductService from "../services/product.service";
import { IProductFullInfoDto } from "../models/dto/ProductFullInfoDto";
import { Link } from "react-router-dom";
import "../css/style.css";
import { AuthContext } from "../components/context/auth.context";
import CartService from "../services/cart.service";
const { Text, Title } = Typography;

const ProductDetailPage: React.FC = () => {
    const [product, setProduct] = useState<IProductFullInfoDto>({} as IProductFullInfoDto);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [amountAvailable, setAmountAvailable] = useState<number>(0);
    const [selectedExtraImage, setSelectedExtraImage] = useState<string>("");
    const [selectedVariantImg, setSelectedVariantImg] = useState<string>("");
    const [selectedVariant, setSelectedVariant] = useState<string>("");
    const [size, setSize] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const { alias } = useParams();
    const tabsRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<string>("description");

    const { customer } = useContext(AuthContext)
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        fetchProduct();
    }, []);
    document.title = product.name || "Chi tiết sản phẩm";

    const fetchProduct = async () => {
        setLoading(true);

        try {
            const productService = new ProductService();
            if (alias) {
                const data = await productService.getProductByAlias(alias);
                setProduct(data);
                setSelectedImage(`http://localhost:5173/src/assets/product-images/${data.mainImage}`);
            } else {
                console.error("Alias is undefined");
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!customer || !customer.id) {
            api.error({
                message: "Thêm vào giỏ hàng thất bại",
                description: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.",
                placement: "topRight",
                duration: 2,
            });
            return;
        }

        try {
            const productDetail = `${selectedVariant ? `Màu sắc: ${selectedVariant},` : ""}${size ? ` Kích thước: ${size}` : ""}`.trim();
            const cartService = new CartService();

            // Call the addToCart API
            const response = await cartService.addToCart(customer.id, product.id, quantity, productDetail);

            // Show success notification if the API call succeeds
            api.success({
                message: "Thêm vào giỏ hàng thành công",
                description: response,
                placement: "topRight",
                duration: 2,
            });
        } catch (error) {
            console.error("Failed to add to cart:", error);

            // Show error notification if the API call fails
            api.error({
                message: "Thêm vào giỏ hàng thất bại",
                description: "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.",
                placement: "topRight",
                duration: 2,
            });
        }
    };

    if (loading) {
        return <div className="text-center mt-4">
            <Spin size="large" />
        </div>;
    }

    const discountedPrice = product.price - (product.price * product.discountPercent) / 100;

    const handleScrollToReviews = () => {
        if (tabsRef.current) {
            tabsRef.current.scrollIntoView({ behavior: "smooth" });
        }
        setActiveTab("ratingAndReview");
    };

    const isAddToCartDisabled = product.variantMap && Object.keys(product.variantMap).length > 0
        ? Object.keys(product.variantMap).includes("Size") && Object.keys(product.variantMap).length === 1
            ? !size // Only size is required
            : !selectedVariant || !size // Both variant and size are required
        : !size; // No variants, only size is required

    const items: TabsProps["items"] = [
        {
            key: "description",
            label: "Mô tả sản phẩm",
            children: product.fullDescription ? (
                <ProductDescriptionTab description={product.fullDescription} />
            ) : (
                <Text type="secondary">Chưa có mô tả chi tiết</Text>
            ),
        },
        {
            key: "detail",
            label: "Thông số kỹ thuật",
            children: product.id ? (
                <ProductDetailTab id={product.id} />
            ) : (
                <Text type="secondary">Chưa có thông số kỹ thuật</Text>
            ),
        },
        {
            key: "ratingAndReview",
            label: "Đánh giá & Nhận xét",
            children: product.id ? (
                <ReviewList id={product.id} />
            ) : (
                <Text type="secondary">Chưa có đánh giá</Text>
            ),
        },
    ];

    return (
        <div className="container my-4">
            <Breadcrumb
                className="mb-4"
                items={[
                    { key: "home", title: <Link to="/">Trang chủ</Link> },
                    ...(product.breadCrumbs?.map((breadCrumb) => ({
                        key: breadCrumb.alias,
                        title: <Link to={`/c/${breadCrumb.alias}`}>{breadCrumb.name}</Link>,
                    })) || []),
                ]}
            />
            {contextHolder}
            <Row gutter={[24, 24]} className="bg-white p-4 rounded shadow-sm">
                {/* Cột trái: Hình ảnh sản phẩm */}
                <Col xs={24} md={8}>
                    <div>
                        {/* Ảnh chính */}
                        <div className="mb-3">
                            <Image
                                src={selectedImage}
                                alt={product.name}
                                className="rounded"
                                width={'100%'}
                                style={{ width: '100%', objectFit: 'contain', maxHeight: '600px' }}
                            />
                        </div>

                        {/* Hình ảnh phụ */}
                        <div className="thumbnail-gallery d-flex flex-wrap justify-content-start gap-2">
                            {product.images && product.images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail-container ${selectedExtraImage.includes(image) ? 'border border-2 border-primary' : 'border'}`}
                                    style={{ width: '60px', height: '60px', cursor: 'pointer', borderRadius: '4px', overflow: 'hidden' }}
                                    onMouseEnter={() => {
                                        setSelectedImage(`http://localhost:5173/src/assets/product-extra-images/${image}`);
                                        setSelectedExtraImage(`http://localhost:5173/src/assets/product-extra-images/${image}`);
                                    }}
                                >
                                    <img
                                        src={`http://localhost:5173/src/assets/product-extra-images/${image}`}
                                        alt={`Product thumbnail ${index + 1}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>

                {/* Cột phải: Thông tin sản phẩm */}
                <Col xs={24} md={16}>
                    {/* Tên sản phẩm và đánh giá */}
                    <div className="product-header">
                        <Title level={2} style={{ marginBottom: '8px' }}>{product.name}</Title>

                        <div className="product-ratings d-flex align-items-center mb-3">
                            <Rate
                                value={product.averageRating}
                                disabled
                                allowHalf
                                style={{ fontSize: '16px' }}
                            />
                            <Text className="ms-2 text-primary"
                                style={{ cursor: 'pointer' }}
                                onClick={handleScrollToReviews}>
                                {product.reviewCount} đánh giá
                            </Text>

                            <Divider type="vertical" style={{ margin: '0 16px' }} />

                            <div className="product-actions">
                                <Tooltip title="Chia sẻ">
                                    <Button type="text" icon={<ShareAltOutlined />} className="p-1" />
                                </Tooltip>
                                <Tooltip title="Yêu thích">
                                    <Button type="text" icon={<HeartOutlined />} className="p-1" />
                                </Tooltip>
                            </div>
                        </div>
                    </div>

                    {/* Giá và ưu đãi */}
                    <div className="price-container p-3 my-3 bg-light rounded">
                        <div className="d-flex align-items-baseline">
                            <Text className="text-danger fw-bold" style={{ fontSize: '28px' }}>
                                <CurrencyFormat price={discountedPrice} />
                            </Text>

                            {product.discountPercent > 0 && (
                                <>
                                    <Text className="ms-3 text-muted" delete style={{ fontSize: '18px' }}>
                                        <CurrencyFormat price={product.price} />
                                    </Text>
                                    <Tag color="orange" className="ms-2">-{product.discountPercent}%</Tag>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Trạng thái sản phẩm */}
                    <div className="mb-3">
                        {product.inStock ? (
                            <Badge status="success" text={<Text className="text-success fs-6">Còn hàng</Text>} />
                        ) : (
                            <Badge status="error" text={<Text className="text-danger fs-6">Hết hàng</Text>} />
                        )}
                    </div>

                    <Divider style={{ margin: '16px 0' }} />

                    {/* Phần variant */}
                    {product.variantMap && Object.entries(product.variantMap).map(([key, value]) => (
                        <div key={key} className="variant-section mb-3">
                            <Text strong className="d-block mb-2">{key}:</Text>
                            <div className="d-flex flex-wrap gap-2">
                                {value.map((val, index) => (
                                    <div
                                        key={index}
                                        className={`variant-item d-flex align-items-center border-hover ${(key !== "Size" && selectedVariantImg === `http://localhost:5173/src/assets/product-variants-images/${val.photo}`) ||
                                            (key === "Size" && size === val.value)
                                            ? 'border-primary selected-variant'
                                            : 'border-secondary'
                                            }`}
                                        style={{
                                            cursor: 'pointer',
                                            padding: '8px 12px',
                                            borderRadius: '4px',
                                            border: '1px solid',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={() => {
                                            if (key !== "Size")
                                                setSelectedImage(`http://localhost:5173/src/assets/product-variants-images/${val.photo}`);
                                        }}
                                        onMouseLeave={() => {
                                            if (key !== "Size")
                                                setSelectedImage(
                                                    selectedVariantImg || selectedExtraImage || `http://localhost:5173/src/assets/product-images/${product.mainImage}`
                                                );
                                        }}
                                        onClick={() => {
                                            if (key !== "Size") {
                                                const variantImage = `http://localhost:5173/src/assets/product-variants-images/${val.photo}`;
                                                setSelectedVariantImg(variantImage);
                                                setSelectedImage(variantImage);
                                                setAmountAvailable(val.quantity);
                                                setSelectedVariant(val.value);
                                            } else if (key === "Size") {
                                                setSize(val.value);
                                            }
                                        }}
                                    >
                                        {val.photo && (
                                            <img
                                                src={`http://localhost:5173/src/assets/product-variants-images/${val.photo}`}
                                                alt={`${key} - ${val.value}`}
                                                style={{ height: '24px', marginRight: '8px' }}
                                            />
                                        )}
                                        <Text>{val.value}</Text>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <Divider style={{ margin: '16px 0' }} />

                    {/* Số lượng */}
                    <div className="quantity-section d-flex align-items-center mb-4">
                        <div className="me-4">
                            <Text strong>Số lượng:</Text>
                            <div className="d-flex align-items-center mt-1">
                                <Button
                                    icon={<MinusOutlined />}
                                    disabled={isAddToCartDisabled || quantity <= 1}
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="rounded"
                                />
                                <div className="mx-2 px-3 py-1 border text-center" style={{ minWidth: '50px' }}>
                                    {quantity}
                                </div>
                                <Button
                                    icon={<PlusOutlined />}
                                    disabled={isAddToCartDisabled || (amountAvailable > 0 && quantity >= amountAvailable)}
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="rounded"
                                />
                                &nbsp;&nbsp;&nbsp;
                                {amountAvailable > 0 && (
                                    <div>
                                        <Text type="secondary">Còn {amountAvailable} sản phẩm</Text>
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>

                    {/* Nút mua hàng */}
                    <div className="buy-buttons d-flex flex-wrap gap-3 mt-4">
                        <Button
                            type="primary"
                            size="large"
                            icon={<ShoppingCartOutlined />}
                            className="px-4 d-flex align-items-center"
                            disabled={isAddToCartDisabled}
                            onClick={() => handleAddToCart()}
                        >
                            Thêm vào giỏ hàng
                        </Button>

                        <Button
                            type="primary"
                            danger
                            size="large"
                            icon={<ThunderboltOutlined />}
                            className="px-4 d-flex align-items-center"
                            disabled={!selectedVariant || !size}
                        >
                            Mua ngay
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Thông tin cửa hàng */}
            <Row className="mt-4">
                <Col span={24}>
                    <div className="bg-white p-4 rounded shadow-sm">
                        <ShopInfo {...product.shopDto} />
                    </div>
                </Col>
            </Row>

            {/* Tabs thông tin chi tiết */}
            <Row className="mt-4">
                <Col span={24}>
                    <div className="bg-white p-4 rounded shadow-sm">
                        <Tabs
                            ref={tabsRef}
                            activeKey={activeTab}
                            onChange={(key) => setActiveTab(key)}
                            defaultActiveKey="description"
                            items={items}
                            className="w-100"
                            size="large"
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ProductDetailPage;
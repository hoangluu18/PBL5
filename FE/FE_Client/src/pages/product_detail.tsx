import { Breadcrumb, Button, Col, Rate, Row, Tabs, TabsProps, Typography, Divider, Tag, Badge, Tooltip, Image, Spin, notification } from "antd";
import CurrencyFormat from "../utils/CurrencyFormat";
import { useContext, useEffect, useRef, useState } from "react";
import { MinusOutlined, PlusOutlined, ShoppingCartOutlined, ThunderboltOutlined, HeartOutlined, ShareAltOutlined } from "@ant-design/icons";
import ProductDescriptionTab from "../components/product_details/ProductDescriptionTab";
import ProductDetailTab from "../components/product_details/ProductDetailTab";
import ReviewList from "../components/product_details/ProductReviews";
import ShopInfo from "../components/product_details/ShopInfo";
import { useLocation, useParams } from "react-router";
import ProductService from "../services/product.service";
import { IProductFullInfoDto } from "../models/dto/ProductFullInfoDto";
import { Link } from "react-router-dom";
import "../css/style.css";
import "../css/product.css"
import { AuthContext } from "../components/context/auth.context";
import CartService from "../services/cart.service";
import { buyNow } from '../services/checkout.service';
import { useNavigate } from 'react-router-dom';
const { Text, Title } = Typography;

const ProductDetailPage: React.FC = () => {
    const [product, setProduct] = useState<IProductFullInfoDto>({} as IProductFullInfoDto);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedMainImage, setSelectedMainImage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});
    const [selectedExtraImage, setSelectedExtraImage] = useState<string>("");
    const [selectedVariantImage, setSelectedVariantImage] = useState<string>("");

    const { alias } = useParams();
    const tabsRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<string>("description");

    const { customer, setCartCount } = useContext(AuthContext)
    const [api, contextHolder] = notification.useNotification();

    const location = useLocation();
    const reviewRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [reloadHeader, setReloadHeader] = useState(false);
    useEffect(() => {
        fetchProduct();
        if (location.hash === "#ratingAndReview") {
            setActiveTab("ratingAndReview");
            setTimeout(() => {
                reviewRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 300); // hoặc thử 500 nếu component load chậm
        }
    }, [reloadHeader]);

    useEffect(() => {
        //console.log("Selected variant updated:", selectedVariant);
    }, [selectedVariant]);

    document.title = product.name || "Chi tiết sản phẩm";

    const fetchProduct = async () => {
        setLoading(true);

        try {
            const productService = new ProductService();
            if (alias) {
                const data = await productService.getProductByAlias(alias);
                setProduct(data);
                setSelectedMainImage(data.mainImage);
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
            const cartService = new CartService();
            // Call the addToCart API
            const productDetail = Object.entries(selectedVariant).map(([key, val]) => `${key}: ${val}`).join(", ")
            const response = await cartService.addToCart(customer.id, product.id, quantity, productDetail);

            if (response === 'Lỗi xác thực: Vui lòng đăng nhập lại') {
                api.error({
                    message: "Thêm vào giỏ hàng thất bại",
                    description: response,
                    placement: "topRight",
                    duration: 2,
                });
                return;
            }
            // Show success notification if the API call succeeds
            api.success({
                message: "Thêm vào giỏ hàng thành công",
                description: response,
                placement: "topRight",
                duration: 2,
            });
            // Update the cart count in the context
            const cartCount = await cartService.countProductByCustomerId(customer.id);
            setCartCount(cartCount);

        } catch (error) {
            // Show error notification if the API call fails
            api.error({
                message: "Thêm vào giỏ hàng thất bại",
                description: "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.",
                placement: "topRight",
                duration: 2,
            });
        }
    };


    const handleBuyNow = async () => {
        if (!customer || !customer.id) {
            api.error({
                message: "Mua hàng thất bại",
                description: "Bạn cần đăng nhập để mua sản phẩm.",
                placement: "topRight",
                duration: 2,
            });
            return;
        }

        try {
            // Sửa lại cách tạo productDetail - không dịch thuộc tính
            const productDetail = Object.entries(selectedVariant).map(([key, val]) => `${key}: ${val}`).join(", ");
            console.log("selectedVariant:" + selectedVariant);
            // Gọi API "Mua ngay"
            await buyNow(customer.id, product.id, quantity, productDetail);

            // Điều hướng đến trang checkout
            navigate("/checkout");
        } catch (error) {
            // Hiển thị thông báo lỗi
            api.error({
                message: "Không thể tiến hành mua hàng",
                description: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
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
                <div ref={reviewRef} >
                    <ReviewList id={product.id}
                        fetchProducts={fetchProduct}
                    />
                </div>
            ) : (
                <Text type="secondary">Chưa có đánh giá</Text>
            ),
        },
    ];

    const handleHoverAndClickImage = (e: any) => {
        const image = e.target.currentSrc;
        setSelectedMainImage(image);
        setSelectedExtraImage(image);
    };

    const handleVariantHover = (img: string) => {
        if (img) {
            setSelectedMainImage(img);
        }
    };

    const handleVariantLeave = (key: string, photo: string) => {
        if (photo && selectedVariant[key]) {
            setSelectedMainImage(selectedVariantImage);
        } else if (photo && !selectedVariant[key]) {
            setSelectedMainImage(product.mainImage);
        }
    }


    const handleSelectVariant = (key: string, val: string, photo: string) => {
        if (photo) {
            setSelectedVariantImage(photo);
        }
        setSelectedVariant((prev) => {
            const updatedVariant = {
                ...prev,
                [key]: val,
            };
            return updatedVariant;
        });

    }


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
                                src={selectedMainImage}
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
                                    className={`${selectedExtraImage.includes(image) ? "border-danger" : "border-secondary"} border rounded`}
                                    style={{ width: '60px', height: '60px', cursor: 'pointer', borderRadius: '4px', overflow: 'hidden' }}
                                >
                                    <img
                                        src={image}
                                        onMouseEnter={handleHoverAndClickImage}
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
                                        style={{
                                            cursor: 'pointer',
                                            padding: '8px 12px',
                                            transition: 'all 0.2s'
                                        }}
                                        className={`${selectedVariant[key]?.includes(val.value) ? 'border-danger' : 'border-secondary'}  img-hover border`}
                                        onMouseEnter={() => handleVariantHover(val.photo)}
                                        onMouseLeave={() => handleVariantLeave(key, val.photo)}
                                        onClick={() => handleSelectVariant(key, val.value, val.photo)}
                                    >
                                        {val.photo && (
                                            <img
                                                src={val.photo}
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
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="rounded"
                                    disabled={!product.inStock || Object.keys(product.variantMap || {}).length !== Object.keys(selectedVariant).length || quantity <= 1}
                                />
                                <div className="mx-2 px-3 py-1 border text-center" style={{ minWidth: '50px' }}>
                                    <Text disabled={!product.inStock || Object.keys(product.variantMap || {}).length !== Object.keys(selectedVariant).length}>{quantity}</Text>
                                </div>
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="rounded"
                                    disabled={!product.inStock || Object.keys(product.variantMap || {}).length !== Object.keys(selectedVariant).length}
                                />
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
                            onClick={() => handleAddToCart()}
                            disabled={!product.inStock || Object.keys(product.variantMap || {}).length !== Object.keys(selectedVariant).length}
                        >
                            Thêm vào giỏ hàng
                        </Button>

                        <Button
                            type="primary"
                            danger
                            size="large"
                            icon={<ThunderboltOutlined />}
                            className="px-4 d-flex align-items-center"


                            onClick={() => handleBuyNow()}

                            disabled={!product.inStock || Object.keys(product.variantMap || {}).length !== Object.keys(selectedVariant).length}

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
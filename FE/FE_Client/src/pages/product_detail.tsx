import { Breadcrumb, Button, Col, Rate, Row, Tabs, TabsProps, Typography, Divider, Tag, Badge, Tooltip, Image, Spin, notification, FloatButton } from "antd";
import CurrencyFormat from "../utils/CurrencyFormat";
import { useContext, useEffect, useRef, useState } from "react";
import { MinusOutlined, PlusOutlined, ShoppingCartOutlined, ThunderboltOutlined, HeartOutlined, ShareAltOutlined, VerticalAlignTopOutlined } from "@ant-design/icons";
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
    const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

    const { alias } = useParams();
    const tabsRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<string>("description");

    const { customer, setCartCount } = useContext(AuthContext)
    const [api, contextHolder] = notification.useNotification();

    const location = useLocation();
    const reviewRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [reloadHeader, setReloadHeader] = useState(false);

    // Effect để theo dõi scroll position
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setShowScrollTop(scrollTop > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper function để kiểm tra xem sản phẩm có variants không
    const hasVariants = () => {
        return product.variantMap && Object.keys(product.variantMap).length > 0;
    };

    // Helper function để kiểm tra xem có đủ variants được chọn không
    const hasAllRequiredVariantsSelected = () => {
        if (!hasVariants()) return true; // Nếu không có variants thì luôn true
        return Object.keys(product.variantMap || {}).length === Object.keys(selectedVariant).length;
    };

    // Helper function để lấy số lượng tối đa có thể mua
    const getMaxQuantity = () => {
        if (!hasVariants()) {
            return 10; // Nếu không có variants, cho phép mua tối đa 10
        }

        const variantStock = getAvailableVariants().currentVariantQuantity;
        return variantStock !== null ? variantStock : 0;
    };

    useEffect(() => {
        fetchProduct();
        if (location.hash === "#ratingAndReview") {
            setActiveTab("ratingAndReview");
            setTimeout(() => {
                reviewRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 300);
        }
    }, [reloadHeader]);

    useEffect(() => {
        const maxQty = getMaxQuantity();
        if (quantity > maxQty) {
            setQuantity(Math.max(1, maxQty));
        }
    }, [selectedVariant, product]);

    const getAvailableVariants = () => {
        // If no color is selected, show unique sizes (removing duplicates)
        if (!selectedVariant["Color"]) {
            if (!product.variantMap?.Size) {
                return {
                    availableSizes: [],
                    currentVariantQuantity: null
                };
            }

            // Get unique sizes by value
            const uniqueSizes: { [key: string]: any } = {};
            product.variantMap.Size.forEach(size => {
                // Only keep one instance of each size value
                if (!uniqueSizes[size.value]) {
                    uniqueSizes[size.value] = size;
                }
            });

            return {
                availableSizes: Object.values(uniqueSizes),
                currentVariantQuantity: null
            };
        }

        // The rest of your existing function remains unchanged
        const selectedColorVariant = product.variantMap?.Color.find(
            color => color.value === selectedVariant["Color"]
        );

        if (!selectedColorVariant) {
            return {
                availableSizes: [],
                currentVariantQuantity: null
            };
        }

        // Filter sizes that have the selected color's ID as their parentId
        const availableSizes = product.variantMap?.Size.filter(
            size => size.parentId === selectedColorVariant.id
        ) || [];

        // Get quantity for the specific color+size combination
        let currentVariantQuantity = null;
        if (selectedVariant["Size"]) {
            const matchingSize = availableSizes.find(
                size => size.value === selectedVariant["Size"]
            );
            currentVariantQuantity = matchingSize?.quantity || 0;
        }

        return {
            availableSizes,
            currentVariantQuantity
        };
    };

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

    // Hàm scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
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

    const handleHoverAndClickImage = (image: string) => {
        setSelectedMainImage(image);
        setSelectedExtraImage(image);
    };

    // Update the handleVariantHover function - already correct but improve clarity
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
    };

    const handleSelectVariant = (key: string, val: string, photo: string) => {
        if (photo) {
            setSelectedVariantImage(photo);
        }

        setSelectedVariant((prev) => {
            const updatedVariant = {
                ...prev,
                [key]: val,
            };

            // If we're changing color, reset the size selection
            // since sizes are dependent on colors
            if (key === "Color" && prev["Size"]) {
                // Check if current size is available for new color
                const selectedColorVariant = product.variantMap?.Color.find(
                    color => color.value === val
                );

                if (selectedColorVariant) {
                    // Check if the currently selected size is available for this color
                    const isSizeAvailable = product.variantMap?.Size.some(
                        size => size.value === prev["Size"] && size.parentId === selectedColorVariant.id
                    );

                    // If size isn't available for this color, reset size selection
                    if (!isSizeAvailable) {
                        delete updatedVariant["Size"];
                    }
                }
            }

            // After updating the variant, check if we need to adjust the quantity
            setTimeout(() => {
                const maxQty = getMaxQuantity();
                if (quantity > maxQty) {
                    setQuantity(Math.max(1, maxQty));
                }
            }, 0);

            return updatedVariant;
        });
    };

    const isVariantAvailable = (variantType: string, variantValue: string) => {
        // For color variants, all are always available
        if (variantType === "Color") {
            return true;
        }

        // For size variants, we need to check if they match the selected color
        if (variantType === "Size" && selectedVariant["Color"]) {
            const selectedColorVariant = product.variantMap?.Color.find(
                color => color.value === selectedVariant["Color"]
            );

            if (!selectedColorVariant) return false;

            // Check if this size is available for the selected color
            return product.variantMap?.Size.some(
                size => size.value === variantValue && size.parentId === selectedColorVariant.id
            ) || false;
        }

        return true;
    };

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
            <Row gutter={[32, 32]} className="bg-white p-4 rounded shadow-sm">
                {/* Cột trái: Hình ảnh sản phẩm */}
                <Col xs={24} lg={10}>
                    <div className="product-image-section">
                        {/* Ảnh chính */}
                        <div
                            className="main-image-container mb-4"
                            style={{
                                height: '500px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '12px',
                                border: '1px solid #e9ecef',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            <Image
                                src={selectedMainImage}
                                alt={product.name}
                                className="rounded"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain'
                                }}
                                preview={{
                                    mask: (
                                        <div style={{
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            fontSize: '14px'
                                        }}>
                                            Xem ảnh lớn
                                        </div>
                                    ),
                                }}
                            />
                        </div>

                        {/* Hình ảnh phụ - Grid layout */}
                        {product.images && product.images.length > 0 && (
                            <div className="thumbnail-gallery">
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                                        gap: '12px',
                                        maxWidth: '500px'
                                    }}
                                >
                                    {product.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`thumbnail-item ${selectedExtraImage.includes(image) ? "active" : ""}`}
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                border: selectedExtraImage.includes(image) ? '2px solid #1890ff' : '2px solid #e9ecef',
                                                transition: 'all 0.3s ease',
                                                position: 'relative'
                                            }}
                                            onMouseEnter={() => handleHoverAndClickImage(image)}
                                            onClick={() => handleHoverAndClickImage(image)}
                                        >
                                            <img
                                                src={image}
                                                alt={`Product thumbnail ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1.05)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                }}
                                            />
                                            {selectedExtraImage.includes(image) && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        backgroundColor: 'rgba(24, 144, 255, 0.1)',
                                                        pointerEvents: 'none'
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Col>

                {/* Cột phải: Thông tin sản phẩm */}
                <Col xs={24} lg={14}>
                    {/* Tên sản phẩm và đánh giá */}
                    <div className="product-header">
                        <Title level={2} style={{ marginBottom: '8px', lineHeight: '1.3' }}>{product.name}</Title>

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
                                ({product.reviewCount} đánh giá)
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
                    <div className="price-container p-4 my-4 bg-light rounded" style={{ backgroundColor: '#f8f9fa' }}>
                        <div className="d-flex align-items-baseline">
                            <Text className="text-danger fw-bold" style={{ fontSize: '32px' }}>
                                <CurrencyFormat price={discountedPrice} />
                            </Text>

                            {product.discountPercent > 0 && (
                                <>
                                    <Text className="ms-3 text-muted" delete style={{ fontSize: '20px' }}>
                                        <CurrencyFormat price={product.price} />
                                    </Text>
                                    <Tag color="orange" className="ms-2" style={{ fontSize: '12px', padding: '4px 8px' }}>
                                        -{product.discountPercent}%
                                    </Tag>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Trạng thái sản phẩm */}
                    <div className="mb-4">
                        {product.inStock ? (
                            <Badge status="success" text={<Text className="text-success fs-6 fw-semibold">Còn hàng</Text>} />
                        ) : (
                            <Badge status="error" text={<Text className="text-danger fs-6 fw-semibold">Hết hàng</Text>} />
                        )}
                    </div>

                    <Divider style={{ margin: '20px 0' }} />

                    {/* Phần variant */}
                    {product.variantMap?.Color && (
                        <div className="variant-section mb-4">
                            <Text strong className="d-block mb-3" style={{ fontSize: '16px' }}>Màu sắc:</Text>
                            <div className="d-flex flex-wrap gap-3">
                                {product.variantMap.Color.map((val, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            cursor: 'pointer',
                                            padding: '10px 16px',
                                            transition: 'all 0.3s ease',
                                            borderRadius: '8px',
                                            border: selectedVariant["Color"] === val.value ? '2px solid #1890ff' : '2px solid #d9d9d9',
                                            backgroundColor: selectedVariant["Color"] === val.value ? '#f0f8ff' : '#ffffff'
                                        }}
                                        className="img-hover"
                                        onMouseEnter={() => handleVariantHover(val.photo)}
                                        onMouseLeave={() => handleVariantLeave("Color", val.photo)}
                                        onClick={() => handleSelectVariant("Color", val.value, val.photo)}
                                    >
                                        {val.photo && (
                                            <img
                                                src={val.photo}
                                                alt={`Color - ${val.value}`}
                                                style={{ height: '28px', marginRight: '8px', borderRadius: '4px' }}
                                            />
                                        )}
                                        <Text style={{ fontWeight: selectedVariant["Color"] === val.value ? 'bold' : 'normal' }}>
                                            {val.value}
                                        </Text>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Size variants */}
                    {product.variantMap?.Size && (
                        <div className="variant-section mb-4">
                            <Text strong className="d-block mb-3" style={{ fontSize: '16px' }}>Kích thước:</Text>
                            <div className="d-flex flex-wrap gap-3">
                                {/* Get available sizes based on selected color */}
                                {getAvailableVariants().availableSizes.map((val, index) => {
                                    const available = isVariantAvailable("Size", val.value);
                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                cursor: available ? 'pointer' : 'not-allowed',
                                                padding: '10px 16px',
                                                transition: 'all 0.3s ease',
                                                borderRadius: '8px',
                                                border: selectedVariant["Size"] === val.value ? '2px solid #1890ff' : '2px solid #d9d9d9',
                                                backgroundColor: selectedVariant["Size"] === val.value ? '#f0f8ff' : '#ffffff',
                                                opacity: available ? 1 : 0.5,
                                                minWidth: '60px',
                                                textAlign: 'center'
                                            }}
                                            className="img-hover"
                                            onClick={() => available && handleSelectVariant("Size", val.value, val.photo)}
                                        >
                                            <Text style={{ fontWeight: selectedVariant["Size"] === val.value ? 'bold' : 'normal' }}>
                                                {val.value}
                                            </Text>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Hiển thị số lượng tồn kho */}
                    {hasVariants() && getAvailableVariants().currentVariantQuantity !== null && (
                        <div className="mb-4">
                            <Text strong className="d-flex align-items-center" style={{ fontSize: '15px' }}>
                                {getAvailableVariants().currentVariantQuantity !== null && getAvailableVariants().currentVariantQuantity > 0 ? (
                                    <>
                                        <span className="text-success me-2" style={{ fontSize: '18px' }}>●</span>
                                        Còn {getAvailableVariants().currentVariantQuantity} sản phẩm
                                    </>
                                ) : (
                                    <span className="text-danger d-flex align-items-center">
                                        <span className="me-2" style={{ fontSize: '18px' }}>●</span>
                                        Hết hàng
                                    </span>
                                )}
                            </Text>
                        </div>
                    )}

                    {/* Hiển thị thông tin cho sản phẩm không có variants */}
                    {!hasVariants() && (
                        <div className="mb-4">
                            <Text strong className="d-flex align-items-center" style={{ fontSize: '15px' }}>
                                <span className="text-info me-2" style={{ fontSize: '18px' }}>●</span>
                                Có thể mua tối đa 10 sản phẩm
                            </Text>
                        </div>
                    )}

                    <Divider style={{ margin: '20px 0' }} />

                    {/* Số lượng */}
                    <div className="quantity-section d-flex align-items-center mb-5">
                        <div className="me-4">
                            <Text strong style={{ fontSize: '16px' }}>Số lượng:</Text>
                            <div className="d-flex align-items-center mt-2">
                                <Button
                                    icon={<MinusOutlined />}
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="rounded"
                                    size="large"
                                    disabled={!product.inStock || !hasAllRequiredVariantsSelected()}
                                />
                                <div className="mx-3 px-4 py-2 border text-center" style={{
                                    minWidth: '60px',
                                    fontSize: '16px',
                                    borderRadius: '6px',
                                    backgroundColor: '#f8f9fa'
                                }}>
                                    <Text disabled={!product.inStock || !hasAllRequiredVariantsSelected()}>
                                        {quantity}
                                    </Text>
                                </div>
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        const maxQty = getMaxQuantity();
                                        if (quantity < maxQty) {
                                            setQuantity((q) => q + 1);
                                        }
                                    }}
                                    className="rounded"
                                    size="large"
                                    disabled={
                                        !product.inStock ||
                                        !hasAllRequiredVariantsSelected() ||
                                        quantity >= getMaxQuantity()
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Nút mua hàng */}
                    <div className="buy-buttons d-flex flex-wrap gap-4 mt-4">
                        <Button
                            type="primary"
                            size="large"
                            icon={<ShoppingCartOutlined />}
                            className="px-6 d-flex align-items-center"
                            style={{
                                height: '50px',
                                fontSize: '16px',
                                borderRadius: '8px',
                                flex: '1',
                                minWidth: '200px'
                            }}
                            onClick={() => handleAddToCart()}
                            disabled={
                                !product.inStock ||
                                !hasAllRequiredVariantsSelected() ||
                                (hasVariants() && getAvailableVariants().currentVariantQuantity !== null && getAvailableVariants().currentVariantQuantity <= 0)
                            }
                        >
                            Thêm vào giỏ hàng
                        </Button>

                        <Button
                            type="primary"
                            danger
                            size="large"
                            icon={<ThunderboltOutlined />}
                            className="px-6 d-flex align-items-center"
                            style={{
                                height: '50px',
                                fontSize: '16px',
                                borderRadius: '8px',
                                flex: '1',
                                minWidth: '150px'
                            }}
                            onClick={() => handleBuyNow()}
                            disabled={
                                !product.inStock ||
                                !hasAllRequiredVariantsSelected() ||
                                (hasVariants() && getAvailableVariants().currentVariantQuantity !== null && getAvailableVariants().currentVariantQuantity <= 0)
                            }
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

            {/* Nút Scroll to Top */}
            <FloatButton
                icon={<VerticalAlignTopOutlined />}
                type="primary"
                style={{
                    right: 24,
                    bottom: 24,
                    display: showScrollTop ? 'block' : 'none'
                }}
                onClick={scrollToTop}
                tooltip="Về đầu trang"
            />
        </div>
    );
};

export default ProductDetailPage;
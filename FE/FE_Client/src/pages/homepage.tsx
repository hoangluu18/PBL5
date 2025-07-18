import CarouselComponent from "../utils/Carousel";
import { Button, Col, Divider, Row, Spin, FloatButton } from "antd";
import SectionHeader from "../utils/SectionHeader";
import CategorySection from "../components/SectionCategory";
import '../css/product.css'
import '../css/style.css'
import ProductCard from "../components/ProductCard";
import IProduct from "../models/dto/ProductDto";
import { useEffect, useState } from "react";
import ProductService from "../services/product.service";
import '../css/homepage.css'

import { DoubleRightOutlined, VerticalAlignTopOutlined } from "@ant-design/icons";

import ChatBot from "../components/ChatBot"; // Import ChatBot component

const Homepage = () => {
    const [page, setPage] = useState<number>(1);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [topProducts, setTopProducts] = useState<IProduct[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // State để theo dõi scroll position
    const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

    useEffect(() => {
        fetchProducts();
    }, [page]);

    // Effect để theo dõi scroll position
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setShowScrollTop(scrollTop > 300); // Hiển thị khi scroll xuống hơn 300px
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    document.title = "Trang chủ";

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const productService = new ProductService();
            const data = await productService.getProducts(page);
            const topProducts = await productService.getTopProducts();
            if (data.length > 0) {
                setProducts([...products, ...data]);
                setTopProducts(topProducts);
            } else {
                setHasMore(false);
            }

        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            <div className="container">
                <CarouselComponent />
                {/* Category section */}
                <div className="mt-4">
                    <SectionHeader
                        title="Danh mục"
                        icon="⚡"
                        color="blue"
                        linkText="Xem thêm"
                        linkUrl="/" />
                    <CategorySection />
                </div>
                <Divider className="mt-5" />

                {/* top deal today */}
                <div className="mt-5">
                    <SectionHeader
                        title="Ưu đãi hàng đầu hôm nay!"
                        icon="⚡"
                        linkText="Xem thêm"
                        color="orange"
                        linkUrl="/" />
                    <Row gutter={[10, 10]}>
                        {topProducts.slice(0, 10).map((topProduct, index) => (
                            <Col className="gutter-row" key={index} span={4}>
                                <ProductCard  {...topProduct} />
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* hint for today */}
                <div className="mt-5">
                    <SectionHeader
                        title="Gợi ý hôm nay!"
                        icon="⚡"
                        color="Blue"
                    />
                    <Row gutter={[10, 10]}>
                        {products.map((product, index) => (
                            <Col className="gutter-row" key={index} span={4}>
                                <ProductCard  {...product} />
                            </Col>
                        ))}
                    </Row>
                    <div>&nbsp;</div>
                    <div className="text-center mt-4">
                        <div className="col-4 mx-auto">
                            {(hasMore || loading) && (
                                <div className="load-more-container">
                                    <Button
                                        type="primary"
                                        ghost
                                        size="large"
                                        icon={loading ? <Spin size="small" /> : <DoubleRightOutlined />}
                                        onClick={() => setPage(page + 1)}
                                        disabled={loading}
                                        className="load-more-button"
                                    >
                                        {loading ? "Đang tải..." : "Xem thêm"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Nút Scroll to Top - Điều chỉnh vị trí để nằm trên ChatBot */}
            <FloatButton
                icon={<VerticalAlignTopOutlined />}
                type="primary"
                style={{
                    right: 24,
                    bottom: 130, // Tăng từ 24px lên 130px để nằm trên ChatBot
                    display: showScrollTop ? 'block' : 'none',
                    zIndex: 1001 // Đảm bảo nằm trên ChatBot
                }}
                onClick={scrollToTop}
                tooltip="Về đầu trang"
            />

            {/* ChatBot component */}
            <ChatBot />
        </>
    );
}

export default Homepage;
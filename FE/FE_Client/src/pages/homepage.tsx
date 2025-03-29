import CarouselComponent from "../utils/Carousel";
import { Col, Divider, Row } from "antd";
import SectionHeader from "../utils/SectionHeader";
import CategorySection from "../components/SectionCategory";
import '../css/product.css'
import '../css/style.css'
import ProductCard from "../components/ProductCard";
import IProduct from "../models/Product";
import { useEffect, useState } from "react";
import ProductService from "../services/product.service";

const Homepage = () => {

    const [products, setProducts] = useState<IProduct[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryService = new ProductService();
                const data = await categoryService.getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

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
                        {products.slice(0, 10).map((product, index) => (
                            <Col className="gutter-row" key={index} span={4}>
                                <ProductCard  {...product} />
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
                        {products.slice(0, 10).map((product, index) => (
                            <Col className="gutter-row" key={index} span={4}>
                                <ProductCard  {...product} />
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </>
    );
}

export default Homepage;
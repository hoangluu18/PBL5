import CarouselComponent from "../utils/Carousel";
import { Col, Divider, Row } from "antd";
import ProductList from "../components/ProductCard";
import SectionHeader from "../utils/SectionHeader";
import CategorySection from "../components/SectionCategory";
import '../css/product.css'
import '../css/style.css'

const Homepage = () => {
    const products = [
        {
            image: "https://via.placeholder.com/150",
            title: "Áo Khoác Nam sanhf dieu dang cap",
            price: 79000,
            discount: 66,
            rating: 4.9,
            sold: 95.4,
        },
        {
            image: "https://via.placeholder.com/150",
            title: "Áo Khoác Nam sanhf dieu dang cap",
            price: 79000,
            discount: 66,
            rating: 4.9,
            sold: 95.4,
        },
        {
            image: "https://via.placeholder.com/150",
            title: "Áo Khoác Nam sanhf dieu dang cap",
            price: 79000,
            discount: 66,
            rating: 4.9,
            sold: 95.4,
        },
        {
            image: "https://via.placeholder.com/150",
            title: "Áo Khoác Nam sanhf dieu dang cap fsdf fasfds fasfadf",
            price: 79000,
            discount: 0,
            rating: 4.9,
            sold: 95.4,
        },
        {
            image: "https://via.placeholder.com/150",
            title: "Áo Khoác Nam sanhf dieu dang cap",
            price: 79000,
            discount: 66,
            rating: 4.9,
            sold: 95.4,
        },
        {
            image: "https://via.placeholder.com/150",
            title: "Set 50 Kẹp Tóc",
            price: 11999,
            discount: 20,
            rating: 4,
            sold: 22.7,
        },
        {
            image: "https://via.placeholder.com/150",
            title: "Túi Xách Nữ",
            price: 215000,
            discount: 23,
            rating: 4.5,
            sold: 46.4,
        },
    ];

    const categories = [
        { title: "Thời Trang Nam", image: "https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b@resize_w640_nl.webp" },
        { title: "Điện Thoại & Phụ Kiện", image: "https://down-vn.img.susercontent.com/file/31234a27876fb89cd522d7e3db1ba5ca@resize_w640_nl.webp" },
        { title: "Thiết Bị Điện Tử", image: "https://down-vn.img.susercontent.com/file/978b9e4cb61c611aaaf58664fae133c5@resize_w640_nl.webp" },
        { title: "Máy Tính & Laptop", image: "https://down-vn.img.susercontent.com/file/c3f3edfaa9f6dafc4825b77d8449999d@resize_w640_nl.webp" },
        { title: "Máy Ảnh & Máy Quay Phim", image: "https://down-vn.img.susercontent.com/file/ec14dd4fc238e676e43be2a911414d4d@resize_w640_nl.webp" },
        { title: "Đồng Hồ", image: "https://down-vn.img.susercontent.com/file/86c294aae72ca1db5f541790f7796260@resize_w640_nl.webp" },
        { title: "Giày Dép Nam", image: "https://down-vn.img.susercontent.com/file/74ca517e1fa74dc4d974e5d03c3139de@resize_w640_nl.webp" },
        { title: "Thiết Bị Điện Gia Dụng", image: "https://down-vn.img.susercontent.com/file/7abfbfee3c4844652b4a8245e473d857@resize_w640_nl.webp" },
        { title: "Thời Trang Nam", image: "https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b@resize_w640_nl.webp" },
        { title: "Điện Thoại & Phụ Kiện", image: "https://down-vn.img.susercontent.com/file/31234a27876fb89cd522d7e3db1ba5ca@resize_w640_nl.webp" },
        { title: "Thiết Bị Điện Tử", image: "https://down-vn.img.susercontent.com/file/978b9e4cb61c611aaaf58664fae133c5@resize_w640_nl.webp" },
        { title: "Máy Tính & Laptop", image: "https://down-vn.img.susercontent.com/file/c3f3edfaa9f6dafc4825b77d8449999d@resize_w640_nl.webp" },
        { title: "Máy Ảnh & Máy Quay Phim", image: "https://down-vn.img.susercontent.com/file/ec14dd4fc238e676e43be2a911414d4d@resize_w640_nl.webp" },
        { title: "Đồng Hồ", image: "https://down-vn.img.susercontent.com/file/86c294aae72ca1db5f541790f7796260@resize_w640_nl.webp" },
        { title: "Giày Dép Nam", image: "https://down-vn.img.susercontent.com/file/74ca517e1fa74dc4d974e5d03c3139de@resize_w640_nl.webp" },
        { title: "Thiết Bị Điện Gia Dụng", image: "https://down-vn.img.susercontent.com/file/7abfbfee3c4844652b4a8245e473d857@resize_w640_nl.webp" },
    ]

    return (
        <>
            <div className="container">
                <CarouselComponent />
                <div className="mt-4">
                    <SectionHeader
                        title="Category"
                        icon="⚡"
                        color="blue"
                        linkText="Explore more"
                        linkUrl="/" />
                    <Row >
                        {categories.map((category, index) => (
                            <Col key={index}>
                                <CategorySection  {...category} />
                            </Col>
                        ))}
                    </Row>
                </div>
                <Divider />
                <div className="mt-5">
                    <SectionHeader
                        title="Top Deals today"
                        icon="⚡"
                        linkText="Explore more"
                        color="orange"
                        linkUrl="/" />
                    <Row gutter={[20, 20]}>
                        {products.slice(0, 10).map((product, index) => (
                            <Col className="gutter-row" span={4} key={index}>
                                <ProductList  {...product} />
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </>
    );
}

export default Homepage;
import { Checkbox, Col, Divider, Layout, Row } from "antd";
import ProductCard from "../components/ProductCard";
import React from "react";
import SectionPagination from "../utils/SectionPagination";

const { Sider, Content } = Layout;

interface Filters {
    availability: string[];
    colorFamily: string[];
    brands: string[];
}

const ProductFilterPage = () => {


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

    const filters: Filters = {
        availability: ["In stock", "Pre-book", "Out of stock"],
        colorFamily: ["Black", "Blue", "Red"],
        brands: ["Blackberry", "Apple", "Nokia", "Sony", "LG"],
    };

    return (
        <>
            <Layout className="container mt-3 bg-transparent">
                <Sider width={175} className="bg-transparent mt-3">
                    <h3>Filters</h3>
                    {Object.keys(filters).map((filterKey) => {
                        const key = filterKey as keyof Filters;
                        return (
                            <React.Fragment key={key}>
                                <div>
                                    <h4>{key.replace(/([A-Z])/g, " $1").trim()}</h4>
                                    {filters[key].map((item) => (
                                        <Checkbox key={item}>{item}</Checkbox>
                                    ))}
                                </div>
                                <Divider />
                            </React.Fragment>
                        );
                    })}
                </Sider>
                <Content className="ps-4">
                    <Row gutter={[20, 20]}>
                        {products.map((product, index) => (
                            <Col key={index} >
                                <ProductCard {...product} />
                            </Col>
                        ))}
                    </Row>
                </Content>
            </Layout>
            <div className="mt-5 text-center">
                <SectionPagination />
            </div>
        </>
    );
};

export default ProductFilterPage;
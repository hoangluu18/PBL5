import React from "react";
import { Carousel } from "antd";

const slides = [
    { id: 1, image: "https://cf.shopee.vn/file/vn-11134258-7ras8-m5184szf0klz56_xxhdpi", bgColor: "#ff4d4f" },
    { id: 2, image: "https://cf.shopee.vn/file/vn-11134258-7ra0g-m70vx8afaes883_xxhdpi", bgColor: "#52c41a" },
    { id: 3, image: "https://cf.shopee.vn/file/vn-11134258-7ra0g-m723yvhuxftk0b_xxhdpi", bgColor: "#1890ff" },
];

const CarouselComponent: React.FC = () => (
    <div className="mt-3 rounded overflow-hidden">
        <Carousel dotPosition="bottom" arrows adaptiveHeight autoplay speed={500}>
            {slides.map((slide) => (
                <div key={slide.id} style={{ height: "500px", width: "100%" }}>
                    <img src={slide.image} alt="" className="img-fluid w-100" />
                </div>
            ))}
        </Carousel>
    </div>
);

export default CarouselComponent;

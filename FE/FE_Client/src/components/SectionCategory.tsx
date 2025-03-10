import { Card } from "antd";
import { Link } from "react-router-dom";

interface ICategory {
    title: string;
    image: string;
}



const CategorySection = (category: ICategory) => {
    return (
        <Link to={"/"}>
            <Card
                hoverable
                className="category-card text-center p-3 pt-2"
                style={{ width: "129px", height: "150px" }}
                cover={
                    <img src={category.image} className="img-fluid" />
                }
                styles={{
                    body: {
                        padding: "0",
                    }
                }}
            >
                <p className="line-clamp-2 mb-1" style={{ lineHeight: "17px" }}>{category.title}</p>
            </Card>
        </Link >
    );
};

export default CategorySection;

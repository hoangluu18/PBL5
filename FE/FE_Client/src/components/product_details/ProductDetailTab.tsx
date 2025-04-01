import { Table } from "antd";
import { useEffect, useState } from "react";
import ProductService from "../../services/product.service";
import IProductDetailDto from "../../models/dto/ProductDetailDto";

interface ProductDetailTabProps {
    id: number;
}

const ProductDetailTab: React.FC<ProductDetailTabProps> = ({ id }) => {
    const [details, setDetails] = useState<IProductDetailDto[]>([]);

    useEffect(() => {
        fetchProduct();
    }, [id]); // Thêm id để tránh lỗi khi thay đổi sản phẩm

    const fetchProduct = async () => {
        try {
            const productService = new ProductService();
            const data = await productService.getProductDetail(id);
            if (Array.isArray(data)) {
                setDetails(data);
            } else {
                setDetails([data]); // Chuyển object thành mảng nếu cần
            }
        } catch (error) {
            console.error("Failed to fetch product details:", error);
        }
    };

    const columns = [
        {
            dataIndex: "name",
            key: "name",
            render: (text: string) => <strong>{text}</strong>,
        },
        {
            dataIndex: "value",
            key: "value",
        },
    ];

    return (
        <div className="w-100 shadow-sm">
            <Table
                columns={columns}
                dataSource={details.map((item, index) => ({
                    key: index.toString(),
                    ...item
                }))}
                pagination={false}
                showHeader={false}
                size="large"
            />
        </div>
    );
};

export default ProductDetailTab;

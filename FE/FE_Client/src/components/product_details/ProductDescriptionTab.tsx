interface ProductDescriptionTabProps {
    description: string;
}

const ProductDescriptionTab: React.FC<ProductDescriptionTabProps> = ({ description }) => {
    return (
        <div className="shadow-sm" style={{ backgroundColor: "#fff", padding: "20px" }}>
            <div dangerouslySetInnerHTML={{ __html: description }}></div>
        </div>
    );
};

export default ProductDescriptionTab;

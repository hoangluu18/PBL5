interface IProduct {
    id: number;
    name: string;
    alias: string;
    price: number;
    discountPercent: number;
    mainImage: string;
    reviewCount: number;
    averageRating: number;
}

export default IProduct;
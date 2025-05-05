export interface Product {
    id: number;
    code: string;
    name: string;
    price: number;
    cost: number;
    quantity: number;
    mainImage: string;
    discountPercent: number;
    lastUpdated: string;
    weight: number;
    width: number;
    height: number;
    length: number;
}

export interface ProductsResponse {
    products: Product[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
}
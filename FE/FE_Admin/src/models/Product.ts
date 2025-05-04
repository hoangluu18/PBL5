export interface Product {
    id: number;
    code: string;
    name: string;
    price: number;
    cost: number;
    quantity: number;
    mainImage: string;
    lastUpdated: string;
}

export interface ProductsResponse {
    products: Product[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
}
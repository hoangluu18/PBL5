import { Review } from "./Review";

export interface ProductSpecification {
    id: number;
    name: string;
    value: string;
}

export interface ProductVariant {
    id: number;
    key: string;
    value: string;
    quantity: number;
    photo?: string;
    parentId?: number;
}

export interface ProductVariantGroup {
    name: string;
    variants: ProductVariant[];
}

export interface ProductDetail {
    id: number;
    code: string;
    name: string;
    alias: string;
    price: number;
    cost: number;
    quantity: number;
    mainImage: string;
    discountPercent: number;
    lastUpdated: string;
    fullDescription?: string;
    enabled: boolean;
    specifications: ProductSpecification[];
    variantGroups: ProductVariantGroup[];
    reviews?: Review[];
    weight: number;
    width: number;
    height: number;
    length: number;
    brandId?: number;
    brandName?: string;
    categoryId?: number;
    categoryName?: string;
}
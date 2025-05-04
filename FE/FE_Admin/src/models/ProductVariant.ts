// Cấu trúc biến thể
interface ProductVariant {
    id: number;
    key: string;    // Ví dụ: "Màu sắc", "Kích cỡ"
    value: string;  // Ví dụ: "Đỏ", "S"
    quantity: number;
    photo?: string;
    parentId: number | null;
}

// Cấu trúc nhóm biến thể
interface ProductVariantGroup {
    name: string;
    variants: ProductVariant[];
}
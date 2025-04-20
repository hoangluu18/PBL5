interface ICartItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    originalPrice: number;  // Giá gốc
    lastPrice: number;  // Giá sau giảm giá
    photo: string | null;
    attributes: string; // key-value của biến thể sản phẩm
    shopId: number;
    shopName: string; // tên shop
    productAlias: string;
    reviewed: boolean; // đã review hay chưa 
}

export default ICartItem;

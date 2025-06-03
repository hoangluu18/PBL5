export interface SearchOrderDto {
    orderTimeFrom: string;
    orderTimeTo: string;
    orderStatus: string[];
    paymentMethod: string[];
    deliveryDateFrom?: string;
    deliveryDateTo?: string;
    city?: string;
    shopId: number;
    keyword?: string;
}

export interface OrderOverviewDto {
    orderId: number;
    orderTime: string;
    customerName: string;
    orderStatus: string;
    paymentMethod: string;
    totalAmount: number;

}

export interface OrderProductsDto {
    productId: number;
    productName: string;
    quantity: number;
    productPrice: number;
    discount: number;
    productAfterDiscount: number;
    totalPrice: number;
}

export interface OrderDetailDto {
    deliveryDate: string;
    shippingFee: number;
    address: string;
    phoneNumber: string;
    orderProducts: OrderProductsDto[];
    note: string;
}


export interface UpdateRequestOrderDto {
    orderId: string
    orderStatus: string
    deliveryDate: string
    paymentMethod: string
}

export interface ExportPdfOrderDto {
    orderId: number;
    customerName: string;
    phoneNumber: string;
    address: string;
    orderTime: string;
    deliveryDate: string;
    orderStatus: string;
    paymentMethod: string;
    note: string;
    orderProducts: OrderProductsDto[];
    shippingFee: number;
    subtotal: number;
    totalQuantity: number;
    total: number;
}

export interface RecentOrdersDto {
    orderId: number;
    customerName: string;
    orderTime: string;
    deliveryDate: string;
    orderStatus: string;
    total: number;
}

export interface Order {
    orderId: number;
    customerName: string;
    phoneNumber: string;
    address: string;
    orderTime: string;
    deliveryDate: string | null;
    orderStatus: string; // 'NEW' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURN_REQUESTED' | 'RETURNED'
    paymentMethod: string;
    note: string;
    orderProducts: OrderProductsDto[];
    shippingFee: number;
    subtotal: number;
    totalQuantity: number;
    total: number;
}
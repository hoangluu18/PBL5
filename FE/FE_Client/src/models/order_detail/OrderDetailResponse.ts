import CartItem from "../CartItem";



export interface OrderDetailsResponse {
    cartProductDtoList: CartItem[];
    orderDto: {
        id: number;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        addressLine: string;
        orderTime: string;
        city: string;
        deliverDate: string;
        deliverDays: number;
        productCost: number;
        shippingCost: number;
        subtotal: number;
        total: number;
        orderStatus: string;
        paymentMethod: string;
        customerId: number;
        shopId: number;
    };
}
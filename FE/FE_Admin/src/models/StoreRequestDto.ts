export interface StoreRequestDto {
    customerId: number;
    storeName: string;
    description: string;
    phoneNumber: string;
    address: string;
}

export interface StoreRequest {
    id: number;
    customerId: number;
    customerName: string;
    customerEmail: string;
    storeName: string;
    description: string;
    phoneNumber: string;
    address: string;
    status: number; // 0: pending, 1: approved, 2: rejected
    requestDate: string;
    responseDate?: string;
    responseNote?: string;
}

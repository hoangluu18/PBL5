export interface StoreRequestDto {
    customerId: number;
    storeName: string;
    description: string;
    phoneNumber: string;
    address: string;
}

export interface StoreRequestDtoImpl extends StoreRequestDto {
    status: number;
    responseDate: Date;
    requestDate: Date;
    responseNote: string;
}
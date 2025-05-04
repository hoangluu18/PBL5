export interface Review {
    id: number;
    productId: number;
    customerId: number;
    customerName: string;
    customerPhoto: string;
    rating: number;
    content: string;
    created_at: string;
    feedback: string | null;
    votes: number;
    votedByCurrentCustomer: boolean;
}
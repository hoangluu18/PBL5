export interface IReviewDto {
    id: number;
    rating: number;
    content: string;
    created_at: string;
    likes: number;
    feedback: string;
    customerName: string;
    customerPhoto: string;
    votedByCurrentCustomer: boolean;
}
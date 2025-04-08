export interface IProfileReviewDto {
    id: number;
    rating: number;
    content: string;
    createdAt: string; 
    likes: number;
    feedback: string;
    productId: number;
    productName: string;
}
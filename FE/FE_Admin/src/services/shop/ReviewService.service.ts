import axios from 'axios';
import { Review } from '../../models/Review';

const API_URL = 'http://localhost:8080/api';

export class ReviewService {
    async getReviewsByProductId(productId: number, page: number = 0): Promise<Review[]> {
        try {
            const response = await axios.get(`${API_URL}/reviews/product/${productId}?page=${page}`);
            return response.data.content;
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return [];
        }
    }
    
    async addFeedbackToReview(reviewId: number, feedback: string): Promise<Review | null> {
        try {
            const response = await axios.post(`${API_URL}/reviews/feedback`, {
                reviewId,
                feedback
            });
            return response.data;
        } catch (error) {
            console.error('Error adding feedback:', error);
            return null;
        }
    }
}
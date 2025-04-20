import axios from "axios";
import { IReviewDto } from "../models/dto/ReviewDto";


const API_URL = 'http://localhost:8081/api/r';

class ReviewService {
    async submitReview(productId: number, customerId: number, rating: number, content: string): Promise<void> {
        try {
            await axios.post(`${API_URL}/submit-review`, {
                productId,
                customerId,
                rating,
                content
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
        }
        catch (error) {
            console.error("Error submitting review:", error);
        }
    }

    async getReviews(productId: number): Promise<IReviewDto[]> {

        let reviews: IReviewDto[] | PromiseLike<IReviewDto[]> = [];

        try {
            const response = await axios.get<IReviewDto[]>(`${API_URL}/${productId}`);
            reviews = response.data;
        } catch (error) {
            console.error(error);
        }

        return reviews;
    }

    async voteReview(reviewId: number, customerId: number): Promise<void> {
        try {
            await axios.post(
                `${API_URL}/vote-review?reviewId=${reviewId}&customerId=${customerId}`,
                {}, // Empty body
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    },
                }
            );
        } catch (error) {
            console.error("Error voting for review:", error);
        }
    }

    async checkReview(productId: number, customerId: number): Promise<string> {

        let reviewRes: string = '';

        try {
            console.log("Checking review status..."); // Debug log
            const response = await axios.post<string>(`${API_URL}/check-review?productId=${productId}&customerId=${customerId}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    },
                }
            );
            reviewRes = response.data;
            console.log("Response from checkReview:", reviewRes); // Debug log
        } catch (error) {
            console.error(error);
        }

        return reviewRes;
    }
}


export default ReviewService;
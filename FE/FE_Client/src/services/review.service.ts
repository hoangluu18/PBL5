import axios from "../axios.customize";
import { IReviewDto } from "../models/dto/ReviewDto";


class ReviewService {
    async submitReview(productId: number, customerId: number, rating: number, content: string): Promise<void> {
        try {
            await axios.post(`/r/submit-review`, {
                productId,
                customerId,
                rating,
                content
            });
        }
        catch (error) {
            console.error("Error submitting review:", error);
        }
    }

    async getReviews(productId: number): Promise<IReviewDto[]> {

        let reviews: IReviewDto[] | PromiseLike<IReviewDto[]> = [];

        try {
            const response = await axios.get<IReviewDto[]>(`/r/${productId}`);
            reviews = response.data;
        } catch (error) {
            console.error(error);
        }

        return reviews;
    }

    async voteReview(reviewId: number, customerId: number): Promise<void> {
        try {
            await axios.post(
                `/r/vote-review?reviewId=${reviewId}&customerId=${customerId}`,
                {}
            );
        } catch (error) {
            console.error("Error voting for review:", error);
        }
    }

    async checkReview(productId: number, customerId: number): Promise<string> {

        let reviewRes: string = '';

        try {
            console.log("Checking review status..."); // Debug log
            const response = await axios.post<string>(`/r/check-review?productId=${productId}&customerId=${customerId}`,
                {}
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
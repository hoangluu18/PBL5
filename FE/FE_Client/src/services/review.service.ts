import axios from "axios";
import { IReviewDto } from "../models/dto/ReviewDto";


const API_URL = 'http://localhost:8081/api/r';

class ReviewService {
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

}


export default ReviewService;
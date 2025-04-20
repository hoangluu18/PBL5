// src/services/profile.service.ts
import axios from "../axios.customize";
import IProfile from "../models/dto/Profile";
import { IProfileReviewDto } from "../models/dto/ProfileReviewDto";

class ProfileService {

    // Lấy thông tin profile
    async getProfile(userId: number): Promise<IProfile | null> {
        try {
            const response = await axios.get<IProfile>(`/profile/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching profile:", error);
            return null;
        }
    }

    // Lấy danh sách bài đánh giá của customer
    async getReviewsByCustomerId(customerId: number): Promise<IProfileReviewDto[]> {
        try {
            const response = await axios.get<{ success: boolean; data: IProfileReviewDto[] }>(
                `/profile/${customerId}/reviews`
            );
            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error("Error fetching customer reviews:", error);
            return [];
        }
    }
}

export default ProfileService;

// src/services/profile.service.ts
import axios from "axios";
import IProfile from "../models/dto/Profile";
import { IProfileReviewDto } from "../models/dto/ProfileReviewDto";

const API_URL = "http://localhost:8081/api/profile";

class ProfileService {
    private getAuthHeader() {
        const token = localStorage.getItem("access_token");
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }

    // Lấy thông tin profile
    async getProfile(userId: number): Promise<IProfile | null> {
        try {
            const response = await axios.get<IProfile>(`${API_URL}/${userId}`, this.getAuthHeader());
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
                `${API_URL}/${customerId}/reviews`,
                this.getAuthHeader()
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

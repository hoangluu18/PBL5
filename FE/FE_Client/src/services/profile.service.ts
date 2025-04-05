// src/services/profile.service.ts
import axios from "axios";
import IProfile from "../models/dto/Profile";

const API_URL = "http://localhost:8081/api/profile"; // Điều chỉnh cổng nếu cần

class ProfileService {
    async getProfile(userId: number): Promise<IProfile | null> {
        try {
            const response = await axios.get<IProfile>(`${API_URL}/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching profile:", error);
            return null;
        }
    }
}

export default ProfileService;
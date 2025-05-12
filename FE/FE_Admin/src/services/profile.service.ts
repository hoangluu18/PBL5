// Tạo file: FE/FE_Admin/src/services/profile.service.ts
import axios from 'axios';

const API_BASE_URL = "http://localhost:8080"; // Replace with your actual API URL

class ProfileService {
    async getUserProfile(userId: number) {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_BASE_URL}/api/users/profile/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }

    async updateUserProfile(userId: number, profileData: any) {
        const token = localStorage.getItem('access_token');
        const response = await axios.put(`${API_BASE_URL}/api/users/profile/${userId}`, profileData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }

    async changePassword(userId: number, passwordData: any) {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_BASE_URL}/api/users/profile/${userId}/change-password`, passwordData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }

    async uploadPhoto(userId: number, file: File) {
        const token = localStorage.getItem('access_token');
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_BASE_URL}/api/users/profile/${userId}/photo`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
}

export default new ProfileService();
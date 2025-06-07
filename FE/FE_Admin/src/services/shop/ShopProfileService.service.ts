import axios from 'axios';

const API_URL = "http://localhost:8080"; // Replace with your actual API URL
export interface ShopProfile {
    id: number;
    name: string;
    description: string;
    address: string;
    phone: string;
    photo: string;
    peopleTracking: number;
    city: string;
    productAmount: number;
    rating: number;
    createdAt: string;
    updatedAt: string;
    enabled: boolean;
    userId: number;
}

export class ShopProfileService {
    async getShopProfile(userId: number): Promise<ShopProfile> {
        try {
            const response = await axios.get(`${API_URL}/api/shop/profile?userId=${userId}`);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching shop profile:", error);
            throw error;
        }
    }

    async updateShopProfile(profile: ShopProfile): Promise<ShopProfile> {
        try {
            const response = await axios.put(`${API_URL}/api/shop/profile`, profile);
            return response.data.data;
        } catch (error) {
            console.error("Error updating shop profile:", error);
            throw error;
        }
    }

    async uploadShopPhoto(file: File, shopId: number): Promise<string> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('shopId', shopId.toString());
            
            // Truyền formData vào request và KHÔNG thiết lập Content-Type
            const response = await axios.post(
                `${API_URL}/api/shop/profile/upload-photo`, 
                formData
            );
            
            return response.data.data;
        } catch (error) {
            console.error('Error uploading shop photo:', error);
            throw error;
        }
    }

async getShopIdByUserId(userId: number): Promise<number> {
    try {
        console.log(`Calling API: ${API_URL}/api/shop/profile/get-shop-id with userId=${userId}`);
        
        // Đảm bảo tham số userId được truyền đúng
        const response = await axios.get(`${API_URL}/api/shop/profile/get-shop-id`, {
            params: { userId }
        });
        
        console.log("API response:", response.data);
        
        if (!response.data || !response.data.data) {
            throw new Error("Invalid response format");
        }
        
        return response.data.data;
    } catch (error) {
        console.error('Error fetching shop ID by user ID:', error);
        throw error;
    }
}


}
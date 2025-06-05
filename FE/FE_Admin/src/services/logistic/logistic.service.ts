import axios from "../../axios.customize";
import { Order } from "../../models/OrderDto";

class LogisticService {

    async getProfile(userId: number): Promise<any> {
        try {
            const response = await axios.get(`/logistic/profile/${userId}`);
            return response.data.data;
        }
        catch (error) {
            console.error("Error fetching profile:", error);
            throw error;
        }
    }

    async updateProfile(profileData: any): Promise<any> {
        try {
            const response = await axios.put(`/logistic/profile`, profileData);
            return response.data.data;
        }
        catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    }

    async getOrders(): Promise<Order[]> {
        try {
            const response = await axios.get("/logistic/orders");
            return response.data.data;
        } catch (error) {
            console.error("Error fetching shop revenue:", error);
            throw error;
        }
    }

    async updateOrderStatus(orderId: string, status: string): Promise<void> {
        try {
            const response = await axios.put(`/logistic/orders/${orderId}/${status}`);
            return response.data;
        } catch (error) {
            console.error("Error updating order status:", error);
            throw error;
        }
    }

}

export default LogisticService;
import axios from "axios";
import { OrderInfoDto } from "../models/dto/OrderInfoDto";

const API_URL = "http://localhost:8081/api/orders";

class OrderService {

    async getOrders(customerId: number): Promise<OrderInfoDto[]> {
        try {

            const response = await axios.get(`${API_URL}?customerId=${customerId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error adding to cart:", error);
            return [];
        }
    }
}

export default OrderService;

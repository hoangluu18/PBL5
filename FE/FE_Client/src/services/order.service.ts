import axios from "../axios.customize";
import { OrderInfoDto } from "../models/dto/OrderInfoDto";

class OrderService {

    async getOrders(customerId: number): Promise<OrderInfoDto[]> {
        try {

            const response = await axios.get(`/orders?customerId=${customerId}`);
            return response.data;
        } catch (error) {
            console.error("Error adding to cart:", error);
            return [];
        }
    }
}

export default OrderService;

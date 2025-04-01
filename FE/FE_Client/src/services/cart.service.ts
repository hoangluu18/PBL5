import axios from "axios";
import ICartItem from "../models/CartItem";

const API_URL = "http://localhost:8081/api/cart";

class CartService {
    async getCart(userId: number): Promise<ICartItem[]> {
        try {
            const response = await axios.get<ICartItem[]>(`${API_URL}/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching cart:", error);
            return [];
        }
    }
    
    async deleteCartItem(customerId: number, productId: number): Promise<void> {
        try {
            // Sửa lại URL theo đường dẫn đúng của backend
            await axios.delete(`${API_URL}/delete/${customerId}/${productId}`);
        } catch (error) {
            console.error("Error deleting cart item:", error);
        }
    }
    
}

export default CartService;

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
    async addToCart(customerId: number, productId: number, quantity: number, productDetail: string): Promise<string> {
        try {

            const response = await axios.post(`${API_URL}/add`, { customerId, productId, quantity, productDetail }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error adding to cart:", error);
            return "Error adding to cart";
        }
    }
}

export default CartService;

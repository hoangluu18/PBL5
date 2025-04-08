import axios from "axios";
import ICartItem from "../models/CartItem";

const API_URL = "http://localhost:8081/api/cart";

class CartService {
    async getCart(userId: number): Promise<ICartItem[]> {
        try {
            const response = await axios.get<ICartItem[]>(`${API_URL}/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching cart:", error);
            return [];
        }
    }

    async deleteCartItem(cartItemId: number): Promise<void> {
        try {
            await axios.delete(`${API_URL}/delete/${cartItemId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
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

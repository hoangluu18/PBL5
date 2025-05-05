import axios from "../axios.customize";
import ICartItem from "../models/CartItem";

class CartService {

    async getCart(userId: number): Promise<ICartItem[]> {
        try {
            // Log token để debug
            console.log("Token:", localStorage.getItem('access_token'));
            console.log("Request to:", `/cart/${userId}`);

            // Thêm header xác thực vào request
            const response = await axios.get<ICartItem[]>(
                `/cart/${userId}`
            );
            console.log("user id", userId);
            return response.data;
        } catch (error) {
            console.error("Error fetching cart:", error);

            // Xử lý lỗi 401 cụ thể
            // if (axios.isAxiosError(error) && error.response?.status === 401) {
            //     console.error("Unauthorized error. Token có thể đã hết hạn hoặc không hợp lệ");
            //     // Xử lý refresh token hoặc đăng xuất ở đây nếu cần
            // }

            return [];
        }
    }

    async deleteCartItem(cartItemId: number): Promise<void> {
        try {
            await axios.delete(`/cart/delete/${cartItemId}`);
        } catch (error) {
            console.error("Error deleting cart item:", error);

            // Xử lý lỗi 401 cụ thể
            // if (axios.isAxiosError(error) && error.response?.status === 401) {
            //     console.error("Unauthorized error. Token có thể đã hết hạn hoặc không hợp lệ");
            // }
        }
    }

    async addToCart(customerId: number, productId: number, quantity: number, productDetail: string): Promise<string> {
        try {

            const response = await axios.post(
                `/cart/add`,
                { customerId, productId, quantity, productDetail }
            );
            return response.data;
        } catch (error) {
            console.error("Error adding to cart:", error);

            // Xử lý lỗi 401 cụ thể
            // if (axios.isAxiosError(error) && error.response?.status === 401) {
            //     console.error("Unauthorized error. Token có thể đã hết hạn hoặc không hợp lệ");
            //     return "Lỗi xác thực: Vui lòng đăng nhập lại";
            // }

            return "Error adding to cart";
        }
    }

    async countProductByCustomerId(customerId: number): Promise<number> {
        try {
            const response = await axios.get<number>(
                `/cart/count/${customerId}`
            );
            return response.data;
        } catch (error) {
            console.error("Error counting products:", error);

            // Xử lý lỗi 401 cụ thể
            // if (axios.isAxiosError(error) && error.response?.status === 401) {
            //     console.error("Unauthorized error. Token có thể đã hết hạn hoặc không hợp lệ");
            // }

            return 0;
        }
    }

    async updateCartItemQuantity(cartItemId: number, quantity: number): Promise<boolean> {
        try {
            const response = await axios.put(
                `/cart/update-quantity/${cartItemId}`,
                { quantity }
            );
            return true;
        } catch (error) {
            console.error("Error updating cart item quantity:", error);
            return false;
        }
    }
}

export default CartService;
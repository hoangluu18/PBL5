import axios from "axios";
import ICartItem from "../models/CartItem";

const API_URL = "http://localhost:8081/api/cart";

class CartService {
    // Hàm trợ giúp để tạo config với header xác thực
    private getAuthConfig() {
        const token = localStorage.getItem('access_token');
        
        // Kiểm tra token tồn tại
        if (!token) {
            console.warn("Không tìm thấy token xác thực. Người dùng có thể chưa đăng nhập.");
            // Có thể redirect đến trang login ở đây nếu cần
        }
        
        return {
            headers: {
                'Authorization': `Bearer ${token || ''}`,
                'Content-Type': 'application/json'
            }
        };
    }

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
            
            // Xử lý lỗi 401 cụ thể
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.error("Unauthorized error. Token có thể đã hết hạn hoặc không hợp lệ");
                // Xử lý refresh token hoặc đăng xuất ở đây nếu cần
            }
            
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
            
            // Xử lý lỗi 401 cụ thể
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.error("Unauthorized error. Token có thể đã hết hạn hoặc không hợp lệ");
            }
        }
    }
    async addToCart(customerId: number, productId: number, quantity: number, productDetail: string): Promise<string> {
        try {
            // Log thông tin debug
            console.log("Adding to cart:", { customerId, productId, quantity, productDetail });
            console.log("Token:", localStorage.getItem('access_token'));
            
            const response = await axios.post(
                `${API_URL}/add`, 
                { customerId, productId, quantity, productDetail }, 
                this.getAuthConfig()
            );
            return response.data;
        } catch (error) {
            console.error("Error adding to cart:", error);
            
            // Xử lý lỗi 401 cụ thể
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.error("Unauthorized error. Token có thể đã hết hạn hoặc không hợp lệ");
                return "Lỗi xác thực: Vui lòng đăng nhập lại";
            }
            
            return "Error adding to cart";
        }
    }
}

export default CartService;
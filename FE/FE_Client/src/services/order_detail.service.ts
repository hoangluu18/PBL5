import axios from 'axios';
import { OrderDetailsResponse } from '../models/order_detail/OrderDetailResponse';

const API_BASE_URL = 'http://localhost:8081/api';

// Hàm trợ giúp để tạo config với header xác thực
const getAuthConfig = () => {
    return {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
        }
    };
};

/**
 * Lấy thông tin chi tiết đơn hàng theo ID
 * @param orderId ID của đơn hàng cần lấy thông tin
 * @param customerId ID của khách hàng (thêm mới)
 * @returns Promise với dữ liệu chi tiết đơn hàng
 */
export const getOrderDetails = async (orderId: number, customerId?: number): Promise<OrderDetailsResponse> => {
    try {
        // Thêm customerId vào URL nếu được cung cấp
        let url = `${API_BASE_URL}/order?orderId=${orderId}`;
        if (customerId) {
            url += `&customerId=${customerId}`;
        }
        
        // Log để debug
        console.log("Calling API:", url);
        console.log("With token:", localStorage.getItem('access_token') ? "Available" : "Not available");
        
        const response = await axios.get<OrderDetailsResponse>(url, getAuthConfig());
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
        throw error;
    }
};

/**
 * Lấy danh sách đơn hàng của khách hàng
 * @param customerId ID của khách hàng
 * @returns Promise với danh sách đơn hàng
 */
export const getCustomerOrders = async (customerId: number): Promise<any[]> => {
    try {
        const response = await axios.get<any[]>(`${API_BASE_URL}/orders?customerId=${customerId}`, getAuthConfig());
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        throw error;
    }
};

export default {
    getOrderDetails,
    getCustomerOrders
};
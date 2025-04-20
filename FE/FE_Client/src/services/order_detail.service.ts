import axios from "../axios.customize";
import { OrderDetailsResponse } from '../models/order_detail/OrderDetailResponse';



/**
 * Lấy thông tin chi tiết đơn hàng theo ID
 * @param orderId ID của đơn hàng cần lấy thông tin
 * @param customerId ID của khách hàng (thêm mới)
 * @returns Promise với dữ liệu chi tiết đơn hàng
 */
export const getOrderDetails = async (orderId: number, customerId?: number): Promise<OrderDetailsResponse> => {
    try {
        // Thêm customerId vào URL nếu được cung cấp
        let url = `/order?orderId=${orderId}`;
        if (customerId) {
            url += `&customerId=${customerId}`;
        }

        // Log để debug
        console.log("Calling API:", url);
        console.log("With token:", localStorage.getItem('access_token') ? "Available" : "Not available");

        const response = await axios.get<OrderDetailsResponse>(url);
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
        const response = await axios.get<any[]>(`/orders?customerId=${customerId}`);
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
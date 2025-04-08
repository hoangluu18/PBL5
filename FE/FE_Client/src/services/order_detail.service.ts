import axios from 'axios';

import { OrderDetailsResponse } from '../models/order_detail/OrderDetailResponse';

const API_BASE_URL = 'http://localhost:8081/api';

/**
 * Lấy thông tin chi tiết đơn hàng theo ID
 * @param orderId ID của đơn hàng cần lấy thông tin
 * @returns Promise với dữ liệu chi tiết đơn hàng
 */
export const getOrderDetails = async (orderId: number): Promise<OrderDetailsResponse> => {
    try {
        const response = await axios.get<OrderDetailsResponse>(`${API_BASE_URL}/order?orderId=${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
        throw error;
    }
};


export default {
    getOrderDetails,
    
};
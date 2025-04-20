import axios from 'axios';
import { CheckoutInfoDto } from '../models/dto/checkout/CheckoutInfoDto';

const API_BASE_URL = 'http://localhost:8081/api/checkout';

// Hàm trợ giúp để tạo config với header xác thực
const getAuthConfig = () => {
    return {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    };
};


export const getCheckoutInfoForSelectedCartItems = async (customerId: number, cartIds: number[]): Promise<CheckoutInfoDto> => {
    try {
        if (!cartIds || cartIds.length === 0) {
            throw new Error('Danh sách sản phẩm trong giỏ hàng không được để trống');
        }
        
        const response = await axios.post<CheckoutInfoDto>(
            `${API_BASE_URL}/${customerId}`,
            cartIds,  // Gửi mảng cartIds trực tiếp như request body
            getAuthConfig()
        );

        console.log('Selected cart items checkout info for customer:', customerId);
        console.log('Cart IDs:', cartIds);

        return response.data;
    } catch (error) {
        console.error('Error fetching checkout info for selected cart items:', error);

        if (axios.isAxiosError(error)) {
            console.error('Status:', error.response?.status);
            console.error('Response data:', error.response?.data);
        }

        throw error;
    }
};

export const saveCheckout = async (customerId: number, cartIds: number[]): Promise<void> => {
    try {
        if (!cartIds || cartIds.length === 0) {
            throw new Error('Danh sách sản phẩm không được để trống');
        }
        
        await axios.post(
            `${API_BASE_URL}/save/${customerId}`,
            cartIds,  // Gửi mảng cartIds làm request body
            getAuthConfig()
        );
        
        console.log('Order saved for customer:', customerId);
        console.log('With cart IDs:', cartIds);
    } catch (error) {
        console.error('Error saving checkout:', error);
        
        if (axios.isAxiosError(error)) {
            console.error('Status:', error.response?.status);
            console.error('Response data:', error.response?.data);
        }
        
        throw error;
    }
};
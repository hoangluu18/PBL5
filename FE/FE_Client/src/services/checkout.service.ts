import axios from 'axios';
import { CheckoutInfoDto } from '../models/dto/checkout/CheckoutInfoDto';

const API_BASE_URL = 'http://localhost:8081/api/checkout';

export const getCheckoutInfo = async (): Promise<CheckoutInfoDto> => {
    try {
        const response = await axios.get<CheckoutInfoDto>(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching checkout info:', error);
        // Log more detailed error information
        if (axios.isAxiosError(error)) {
            console.error('Status:', error.response?.status);
            console.error('Response data:', error.response?.data);
        }
        throw error;
    }
};

export const saveCheckout = async (customerId: number): Promise<void> => {
    try {
        await axios.post(`${API_BASE_URL}/save?customerId=${customerId}`);
    } catch (error) {
        console.error('Error saving checkout:', error);
        throw error;
    }
};
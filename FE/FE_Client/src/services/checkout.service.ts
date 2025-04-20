import axios from "../axios.customize";
import { CheckoutInfoDto } from '../models/dto/checkout/CheckoutInfoDto';


export const getCheckoutInfoForSelectedCartItems = async (customerId: number, cartIds: number[]): Promise<CheckoutInfoDto> => {
    try {
        if (!cartIds || cartIds.length === 0) {
            throw new Error('Danh sách sản phẩm trong giỏ hàng không được để trống');
        }

        const response = await axios.post<CheckoutInfoDto>(
            `/checkout/${customerId}`,
            cartIds,  // Gửi mảng cartIds trực tiếp như request body
        );

        console.log('Selected cart items checkout info for customer:', customerId);
        console.log('Cart IDs:', cartIds);

        return response.data;
    } catch (error) {
        console.error('Error fetching checkout info for selected cart items:', error);

        // if (axios.isAxiosError(error)) {
        //     console.error('Status:', error.response?.status);
        //     console.error('Response data:', error.response?.data);
        // }

        throw error;
    }
};

export const saveCheckout = async (customerId: number, cartIds: number[]): Promise<void> => {
    try {
        if (!cartIds || cartIds.length === 0) {
            throw new Error('Danh sách sản phẩm không được để trống');
        }

        await axios.post(
            `/checkout/save/${customerId}`,
            cartIds,  // Gửi mảng cartIds làm request body
        );

        console.log('Order saved for customer:', customerId);
        console.log('With cart IDs:', cartIds);
    } catch (error) {
        console.error('Error saving checkout:', error);

        // if (axios.isAxiosError(error)) {
        //     console.error('Status:', error.response?.status);
        //     console.error('Response data:', error.response?.data);
        // }

        throw error;
    }
};

export const buyNow = async (
    customerId: number,
    productId: number,
    quantity: number,
    productDetail: string
): Promise<CheckoutInfoDto> => {
    try {
        const response = await axios.post<CheckoutInfoDto>(
            `/checkout/buy-now/${customerId}`,
            {
                productId,
                quantity,
                productDetail
            },
        );

        console.log('Buy Now checkout info for customer:', customerId);
        console.log('For product:', productId);

        // Lưu thông tin "Mua ngay" vào localStorage để sử dụng trong trang checkout
        localStorage.setItem('buyNowInfo', JSON.stringify(response.data));
        localStorage.setItem('isBuyNow', 'true');

        // Thêm timestamp để kiểm tra thời gian lưu
        localStorage.setItem('buyNowTimestamp', Date.now().toString());
        return response.data;
    } catch (error) {
        console.error('Error getting buy now checkout info:', error);

        // if (axios.isAxiosError(error)) {
        //     console.error('Status:', error.response?.status);
        //     console.error('Response data:', error.response?.data);
        // }

        throw error;
    }
};

export const clearBuyNowData = (): void => {
    localStorage.removeItem('buyNowInfo');
    localStorage.removeItem('isBuyNow');
    localStorage.removeItem('buyNowTimestamp');
};

export const saveCheckoutBuyNow = async (customerId: number): Promise<void> => {
    try {
        // Lấy dữ liệu từ localStorage
        const buyNowInfo = localStorage.getItem('buyNowInfo');
        if (!buyNowInfo) {
            throw new Error('Không tìm thấy thông tin mua ngay');
        }

        const checkoutInfo = JSON.parse(buyNowInfo);

        await axios.post(
            `/checkout/save-buy-now/${customerId}`,
            checkoutInfo,  // Gửi toàn bộ thông tin checkout từ localStorage
        );

        console.log('Buy now order saved for customer:', customerId);
    } catch (error) {
        console.error('Error saving buy now checkout:', error);

        // if (axios.isAxiosError(error)) {
        //     console.error('Status:', error.response?.status);
        //     console.error('Response data:', error.response?.data);
        // }

        throw error;
    }
};
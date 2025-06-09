import axios from '../../axios.customize';

export interface ShopWalletInfo {
    id: number;
    balance: number;
    status: string;
    shopName: string;
    shopId: number;
}

export interface ShopTransactionInfo {
    id: number;
    type: string;
    amount: number;
    status: string;
    description: string;
    createdAt: string;
    orderId?: number;
}

export interface ShopWalletStatistics {
    totalReceived: number;
    totalRefunded: number;
    totalTransactions: number;
    currentBalance: number;
}

class ShopWalletService {
    
    /**
     * Lấy thông tin ví của shop
     */
    async getShopWalletInfo(userId: number): Promise<ShopWalletInfo> {
        try {
            const response = await axios.get(`/shop/wallet/info/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching shop wallet info:', error);
            throw error;
        }
    }

    /**
     * Lấy lịch sử giao dịch của shop
     */
    async getShopTransactions(userId: number): Promise<ShopTransactionInfo[]> {
        try {
            const response = await axios.get(`/shop/wallet/transactions/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching shop transactions:', error);
            throw error;
        }
    }

    /**
     * Lấy thống kê ví của shop
     */
    async getShopWalletStatistics(userId: number): Promise<ShopWalletStatistics> {
        try {
            const response = await axios.get(`/shop/wallet/statistics/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching shop wallet statistics:', error);
            throw error;
        }
    }
}

export default new ShopWalletService();
import axios from '../axios.customize';

export interface WalletInfo {
    id: number;
    balance: number;
    status: string;
}

export interface TransactionInfo {
    id: number;
    amount: number;
    type: string;
    status: string;
    createdAt: string;
    description: string;
}

export interface DepositRequest {
    customerId: number;
    amount: number;
}

class WalletService {
    async getWalletInfo(customerId: number): Promise<WalletInfo> {
        const response = await axios.get(`/wallet/${customerId}`);
        return response.data;
    }

    async depositToWallet(customerId: number, amount: number): Promise<any> {
        const request: DepositRequest = {
            customerId,
            amount
        };
        const response = await axios.post('/wallet/deposit', request);
        return response.data;
    }

    async getTransactions(customerId: number): Promise<TransactionInfo[]> {
        const response = await axios.get(`/wallet/${customerId}/transactions`);
        return response.data;
    }

    async checkBalance(customerId: number, amount: number): Promise<any> {
        const response = await axios.get(`/wallet/${customerId}/check-balance?amount=${amount}`);
        return response.data;
    }
}

export default new WalletService();
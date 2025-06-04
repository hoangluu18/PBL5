import axios from '../axios.customize';

interface PaymentResponse {
    message: string;
    orderId: number;
    amount: number;
    escrowId: number;
}

class PaymentService {
    async payWithWallet(customerId: number, orderId: number, amount: number): Promise<PaymentResponse> {
        const request = {
            customerId,
            orderId,
            amount
        };

        const response = await axios.post('payment/pay', request);
        return response.data;
    }

    async checkStatus(orderId: number): Promise<any> {
        const response = await axios.get(`payment/status/${orderId}`);
        return response.data;
    }

    async requestRefund(orderId: number): Promise<any> {
        const response = await axios.post(`payment/refund/${orderId}`);
        return response.data;
    }
}

export default new PaymentService();
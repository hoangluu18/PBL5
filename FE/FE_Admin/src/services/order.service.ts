import axios from "../axios.customize";
import { ExportPdfOrderDto, OrderDetailDto, OrderOverviewDto, RecentOrdersDto, SearchOrderDto, UpdateRequestOrderDto } from "../models/OrderDto";


class OrderService {
    async updateOrder(updateRequest: UpdateRequestOrderDto): Promise<any> {
        let res: any | PromiseLike<any> = {} as any;
        try {
            const response = await axios.post(`/salesperson/order/update`, updateRequest);
            res = response.data.data;
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            throw error;
        }
        return res;
    }

    async getOrder(searchDto: SearchOrderDto): Promise<OrderOverviewDto[]> {
        let res: any | PromiseLike<OrderOverviewDto[]> = {} as any;
        try {
            const response = await axios.get(`/salesperson/orders/search`, { params: searchDto });
            res = response.data.data;
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            throw error;
        }
        return res;
    }

    async getOrderDetail(orderId: number): Promise<OrderDetailDto> {
        let res: any | PromiseLike<OrderDetailDto> = {} as any;
        try {
            const response = await axios.get(`/salesperson/order-detail/${orderId}`);
            res = response.data.data;
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            throw error;
        }
        return res;
    }

    async exportPdf(orderDetailDto: ExportPdfOrderDto): Promise<Blob> {
        try {
            const response = await axios.post(
                `/salesperson/order/export-pdf`,
                orderDetailDto,
                { responseType: 'blob' }
            );

            // Kiểm tra Content-Type của response
            const contentType = response.headers['content-type'];
            if (contentType && contentType.includes('application/json')) {
                // Server trả về lỗi dạng JSON thay vì PDF
                const text = await new Response(response.data).text();
                const error = JSON.parse(text);
                throw new Error(error.message || 'Lỗi xuất PDF');
            }

            return response.data;
        } catch (error) {
            console.error("Error exporting PDF:", error);
            throw error;
        }
    }

    async exportMultiplePdf(orderIds: number[]): Promise<Blob> {
        try {
            const response = await axios.post(
                `/salesperson/orders/export-pdf-batch`,
                orderIds,
                {
                    responseType: 'blob',
                    headers: {
                        'Accept': 'application/zip'
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error("Error exporting multiple PDFs:", error);
            throw error;
        }
    }

    async getRecentOrders(shopId: number): Promise<RecentOrdersDto[]> {
        let res: any | PromiseLike<RecentOrdersDto[]> = {} as any;
        try {
            const response = await axios.get(`/salesperson/recent-orders?shopId=${shopId}`);
            res = response.data.data;
        } catch (error) {
            console.error("Error fetching recent orders:", error);
            throw error;
        }
        return res;
    }
}

export default OrderService;
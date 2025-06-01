import axios from "../../axios.customize";
import { ShopRevenue, ShopStatistic } from "../../models/AdminDto";

class AdminService {

    async getShopRevenue(date: string): Promise<ShopRevenue[]> {
        try {
            const response = await axios.get(`/admin/shop-revenue?date=${date}`);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching shop revenue:", error);
            throw error;
        }
    }
    async getShopStatistic(date: string): Promise<ShopStatistic[]> {
        try {
            const response = await axios.get(`/admin/shop-statistic?date=${date}`);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching shop revenue:", error);
            throw error;
        }
    }


}

export default AdminService;
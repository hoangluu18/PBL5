import axios from "../axios.customize";
import { ReportDto, TodayStatisticDto, TopProductDto } from "../models/DashboardDto";

class DashboardService {
    async getTodayStatistic(shopId: number): Promise<TodayStatisticDto> {

        let res: TodayStatisticDto | PromiseLike<TodayStatisticDto> = {} as TodayStatisticDto;
        try {
            const response = await axios.get(`/salesperson/today-statistic?shopId=${shopId}`);
            res = response.data.data;
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            throw error;
        }
        return res;
    }

    async getStatisticByXDaysOrXMonths(shopId: number, date: string): Promise<ReportDto> {
        let res: ReportDto | PromiseLike<ReportDto> = {} as ReportDto;
        try {
            const response = await axios.get(`/salesperson/statistic/${date}?shopId=${shopId}`);
            res = response.data.data;
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            throw error;
        }
        return res;
    }

    async getStatisticByDateRange(shopId: number, startDate: string, endDate: string): Promise<ReportDto> {
        let res: ReportDto | PromiseLike<ReportDto> = {} as ReportDto;
        try {
            const response = await axios.get(`/salesperson/statistic/${startDate}/${endDate}?shopId=${shopId}`);
            res = response.data.data;
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            throw error;
        }
        return res;
    }

    async getTopProduct(shopId: number, date: string): Promise<TopProductDto[]> {
        let res: TopProductDto[] | PromiseLike<TopProductDto[]> = [] as TopProductDto[];

        try {
            const response = await axios.get(`/salesperson/statistic/top-product/${date}?shopId=${shopId}`);
            res = response.data.data;
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            throw error;
        }
        return res;
    }
}

export default DashboardService;
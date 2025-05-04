export interface TodayStatisticDto {
    invoiceCount: number;
    totalRevenue: number;
    returnedOrderCount: number;
    changeFromYesterday: number;
    totalProductSoldToday: number;
}

export interface ReportDto {
    identifier: string;
    grossRevenue: number;
    totalOrder: number;
    netProfit: number;
}

export interface TopProductDto {
    identifier: string;
    productName: string;
    totalAmount: number;
    totalRevenue: number;
}
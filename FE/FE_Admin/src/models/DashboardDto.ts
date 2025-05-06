export interface TodayStatisticDto {
    invoiceCount: number;
    totalRevenue: number;
    returnedOrderCount: number;
    changeFromYesterday: number;
    totalProductSoldToday: number;
}

export interface ReportDto {
    map(arg0: (item: ReportDto) => { netRevenue: number; day: string; orders: number; grossRevenue: number; identifier: string; totalOrder: number; netProfit: number; }): unknown;
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
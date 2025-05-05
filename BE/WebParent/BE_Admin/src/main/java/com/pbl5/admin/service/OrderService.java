package com.pbl5.admin.service;

import com.pbl5.admin.dto.dashboard.RevenueReportDto;
import com.pbl5.admin.dto.dashboard.TodayStatisticDto;
import com.pbl5.admin.dto.dashboard.TopProductReportDto;
import com.pbl5.admin.dto.orders.*;

import java.util.List;

public interface OrderService {


    void updateOrder(OrderStatusDto orderStatusDto);

    TodayStatisticDto getTodayStatistic(int shopId);

    List<RecentOrderDto> getRecentOrders(int shopId);

    List<RevenueReportDto> getReportByXMonths(int months, int shopId);

    List<RevenueReportDto> getReportByDateRange(String startDate, String endDate, int shopId);

    List<TopProductReportDto> getTopProductReport(String date, int shopId);

    List<OrderOverviewDto> searchOrders(OrderSearchDto searchDto);

    OrderExtraInfo getOrderExtraInfo(int orderId);

    OrderDetailDto getOrderDetails(int orderId);
}

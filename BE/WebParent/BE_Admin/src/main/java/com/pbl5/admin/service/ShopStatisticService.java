package com.pbl5.admin.service;

import com.pbl5.admin.dto.admin.ShopRevenueDto;
import com.pbl5.admin.dto.admin.ShopStatisticDto;
import com.pbl5.admin.dto.admin.ShopStatisticProjection;

import java.util.List;

public interface ShopStatisticService {
    List<ShopRevenueDto> getShopRevenue(String date);

    List<ShopStatisticDto> getShopStatistic(String date);
}

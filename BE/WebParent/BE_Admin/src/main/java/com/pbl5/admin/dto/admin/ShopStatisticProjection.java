package com.pbl5.admin.dto.admin;

import java.math.BigDecimal;


public interface ShopStatisticProjection {
    Integer getId();
    String getShopName();
    Double getTotalOrders();
    Long getCompletedOrders();
    Long getCanceledOrders();
    Long getFailedOrders();
    Double getRevenue(); // Nếu revenue trong SQL là double
    BigDecimal getCompletionRate();
}
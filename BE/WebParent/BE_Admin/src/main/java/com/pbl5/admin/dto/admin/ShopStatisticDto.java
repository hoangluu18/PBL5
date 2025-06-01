package com.pbl5.admin.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShopStatisticDto {
    private Integer id;
    private String shopName;
    private Double totalOrders;
    private Long completedOrders;
    private Long canceledOrders;
    private Long failedOrders;
    private Double revenue;
    private BigDecimal completionRate;
}
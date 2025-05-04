package com.pbl5.admin.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueReportDto {

    private String identifier;
    private Double grossRevenue;
    private Long totalOrder;
    private Double netProfit;
}

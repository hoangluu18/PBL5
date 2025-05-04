package com.pbl5.admin.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopProductReportDto {
    private String identifier;
    private String productName;
    private BigDecimal totalAmount;
    private Double totalRevenue;
}

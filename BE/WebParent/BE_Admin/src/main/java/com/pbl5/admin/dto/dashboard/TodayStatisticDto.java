package com.pbl5.admin.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TodayStatisticDto {

    private long invoiceCount;
    private Float totalRevenue;
    private long returnedOrderCount;
    private Float changeFromYesterday;
    private Integer totalProductSoldToday;
}

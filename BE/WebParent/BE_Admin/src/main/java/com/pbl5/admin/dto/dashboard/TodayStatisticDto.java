package com.pbl5.admin.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TodayStatisticDto {

    private Integer invoiceCount;
    private Integer totalRevenue;
    private Float changeFromYesterday;
    private Float changeFromLastWeek;
}

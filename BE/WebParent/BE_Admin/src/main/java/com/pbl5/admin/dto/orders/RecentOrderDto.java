package com.pbl5.admin.dto.orders;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentOrderDto {
    private Integer orderId;
    private String customerName;
    private Float total;
    private String orderStatus;
    private String orderTime;
    private String deliveryDate;
}

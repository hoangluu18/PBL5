package com.pbl5.admin.dto.orders;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderOverviewDto {
    private int orderId;
    private String orderTime;
    private String customerName;
    private String orderStatus;
    private String paymentMethod;
    private Float totalAmount;

}

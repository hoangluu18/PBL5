package com.pbl5.admin.dto.orders;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatusDto {
    private String deliveryDate;
    private int orderId;
    private String orderStatus;
    private String paymentMethod;
}

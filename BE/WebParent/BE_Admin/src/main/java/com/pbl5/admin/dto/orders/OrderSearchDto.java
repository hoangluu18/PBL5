package com.pbl5.admin.dto.orders;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderSearchDto {
    private String orderTimeFrom;
    private String orderTimeTo;
    private String[] orderStatus;
    private String[] paymentMethod;
    private String deliveryDateFrom;
    private String deliveryDateTo;
    private String city;
    private String keyword;
    private int shopId;
}

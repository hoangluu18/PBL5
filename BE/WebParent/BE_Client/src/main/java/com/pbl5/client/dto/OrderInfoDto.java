package com.pbl5.client.dto;

import lombok.Data;

@Data
public class OrderInfoDto {

    private Integer orderId;
    private String orderDate;
    private String orderStatus;
    private float totalAmount;
}

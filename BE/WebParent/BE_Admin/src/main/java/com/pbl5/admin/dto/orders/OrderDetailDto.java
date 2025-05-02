package com.pbl5.admin.dto.orders;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailDto {
    private Integer orderId;
    private String customerName;
    private String phoneNumber;
    private String address;
    private String orderTime;
    private String deliveryDate;
    private String orderStatus;
    private String paymentMethod;
    private String note;
    private List<OrderProductsDto> orderProducts;
    private Float shippingFee;
    private Float subtotal;
    private Integer totalQuantity;
    private Float total;
}
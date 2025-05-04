package com.pbl5.admin.dto.orders;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderExtraInfo {
    private String deliveryDate;
    private String address;
    private String phoneNumber;
    private Float shippingFee;
    private String note;
    private List<OrderProductsDto> orderProducts;
}

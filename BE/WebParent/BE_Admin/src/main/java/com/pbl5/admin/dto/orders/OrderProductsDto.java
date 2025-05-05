package com.pbl5.admin.dto.orders;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderProductsDto {
    private Integer productId;
    private String productName;
    private Integer quantity;
    private Float productPrice;
    private Float discount;
    private Float productAfterDiscount;
    private Float totalPrice;
}

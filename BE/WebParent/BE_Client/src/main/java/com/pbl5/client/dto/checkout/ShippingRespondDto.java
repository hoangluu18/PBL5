package com.pbl5.client.dto.checkout;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ShippingRespondDto {
    private int shopId;
    private String shippingCompany;
    private float shippingCost;
    private String estimatedDeliveryTime;
}

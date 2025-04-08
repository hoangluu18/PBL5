package com.pbl5.client.dto.checkout;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ShippingRequestDto {
    private int shopId;
    private float weight;
    private float height;
    private float width;
    private float length;
    private String deliveryPoint;
    private String receivingPoint;
}



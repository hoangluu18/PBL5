package com.pbl5.client.dto.checkout;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BuyNowRequestDto {
    private Integer productId;
    private Integer quantity;
    private String productDetail;
}

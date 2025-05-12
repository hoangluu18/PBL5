package com.pbl5.client.dto.checkout;

import lombok.Data;

@Data
public class SaveBuyNowRequest {
    private CheckoutInfoDto checkoutInfo;
    private String paymentMethod;
}

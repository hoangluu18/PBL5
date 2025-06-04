package com.pbl5.client.dto.checkout;

import lombok.Data;
import java.util.List;

@Data
public class SaveCheckoutRequest {
    private List<Integer> cartIds;
    private String paymentMethod;
}

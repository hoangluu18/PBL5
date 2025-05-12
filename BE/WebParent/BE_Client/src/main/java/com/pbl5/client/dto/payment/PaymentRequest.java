package com.pbl5.client.dto.payment;

import lombok.Data;

@Data
public class PaymentRequest {
    private Integer customerId;
    private Integer orderId;
}
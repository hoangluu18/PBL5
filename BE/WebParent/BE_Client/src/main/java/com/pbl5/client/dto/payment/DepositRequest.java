package com.pbl5.client.dto.payment;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DepositRequest {
    private Integer customerId;
    private BigDecimal amount;
}

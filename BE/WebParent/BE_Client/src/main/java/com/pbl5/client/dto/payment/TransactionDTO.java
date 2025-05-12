package com.pbl5.client.dto.payment;


import com.pbl5.common.entity.Transaction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private Integer id;
    private BigDecimal amount;
    private String type;
    private String status;
    private Date createdAt;
    private String description;

    // Constructor để chuyển đổi từ Entity sang DTO
    public TransactionDTO(Transaction transaction) {
        this.id = transaction.getId();
        this.amount = transaction.getAmount();
        this.type = transaction.getType().toString();
        this.status = transaction.getStatus().toString();
        this.createdAt = transaction.getCreatedAt();
        this.description = transaction.getDescription();
    }

    // Phương thức tiện ích để chuyển đổi danh sách Entity sang danh sách DTO
    public static List<TransactionDTO> fromEntityList(List<Transaction> transactions) {
        return transactions.stream()
                .map(TransactionDTO::new)
                .collect(Collectors.toList());
    }
}
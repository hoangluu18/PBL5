package com.pbl5.common.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "escrows")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Escrow extends IdBaseEntity {

    @Column(name = "amount", precision = 15, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "status", length = 20, nullable = false)
    @Enumerated(EnumType.STRING)
    private EscrowStatus status;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false, unique = true,referencedColumnName = "id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "customer_wallet_id", nullable = true)
    private Wallet customerWallet;

    @ManyToOne
    @JoinColumn(name = "shop_wallet_id", nullable = false)
    private Wallet shopWallet;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "released_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date releasedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }

    public enum EscrowStatus {
        HOLDING,   // Đang giữ tiền
        RELEASED,  // Đã chuyển tiền cho shop
        REFUNDED   // Đã hoàn tiền cho khách
    }

    @Column(name = "payment_method")
    private String paymentMethod;
}
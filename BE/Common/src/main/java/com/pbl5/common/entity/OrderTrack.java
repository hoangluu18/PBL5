package com.pbl5.common.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "order_track")
@Data
public class OrderTrack extends IdBaseEntity {

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private OrderStatus status;

    @Column(name = "updated_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedTime;

    @Column(name = "notes", length = 256)
    private String notes;

    public enum OrderStatus {
        CANCELLED, DELIVERED, NEW, PACKAGED, PAID, PICKED, PROCCESSING, REFUNDED, RETURNED, RETURN_REQUESTED, SHIPPING
    }
}
package com.pbl5.common.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shop_tracking")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class ShopTracking extends IdBaseEntity {

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

}
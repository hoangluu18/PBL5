package com.pbl5.common.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;


@Entity
@Table(name = "shop_tracking")
@NoArgsConstructor
@AllArgsConstructor

@Data
public class ShopTracking extends IdBaseEntity {

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Override
    public boolean equals(Object o) {
        if(this == o) return true;
        if(!(o instanceof ShopTracking that)) return false;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}


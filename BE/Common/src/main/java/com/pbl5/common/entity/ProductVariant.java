package com.pbl5.common.entity;

import com.pbl5.common.entity.IdBaseEntity;
import com.pbl5.common.entity.product.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
public class ProductVariant extends IdBaseEntity {

    @Column(length = 50)
    private String key;
    @Column(length = 50)
    private String value;
    private Integer quantity;
    @Column(length = 64)
    private String photo;

    @Column(name = "parent_id")
    private Integer parentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Override
    public String toString() {
        return "ProductVariant{" +
                "key='" + key + '\'' +
                ", value='" + value + '\'' +
                ", quantity=" + quantity +
                ", photo='" + photo + '\'' +
                '}';
    }
}
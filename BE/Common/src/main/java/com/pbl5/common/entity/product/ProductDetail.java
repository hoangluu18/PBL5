package com.pbl5.common.entity.product;


import com.pbl5.common.entity.IdBaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "product_details")
@Getter
@Setter
public class ProductDetail extends IdBaseEntity {

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 255)
    private String value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;


}

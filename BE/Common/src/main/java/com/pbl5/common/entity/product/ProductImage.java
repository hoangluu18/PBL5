package com.pbl5.common.entity.product;

import com.pbl5.common.entity.IdBaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "product_images")
@Setter
@Getter
public class ProductImage extends IdBaseEntity {

    @Column(nullable = false)
    private String photo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;


}
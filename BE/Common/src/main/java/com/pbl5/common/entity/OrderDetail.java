package com.pbl5.common.entity;

import com.pbl5.common.entity.product.Product;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_details")
@Data
public class OrderDetail extends IdBaseEntity {

    @Column(name = "product_cost")
    private Float productCost;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "shipping_cost")
    private Float shippingCost;

    @Column(name = "subtotal", nullable = false)
    private Float subtotal;

    @Column(name = "unit_price")
    private Float unitPrice;

    @Column(name = "product_variant_detail", length = 100)
    private String productVariantDetail;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}
package com.pbl5.common.entity;

import com.pbl5.common.entity.product.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "reviews")
@Getter
@Setter
public class Review extends IdBaseEntity{

    private int rating;
    private String content;
    private Date created_at;
    private int likes;
    private String feedback;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Override
    public String toString() {
        return "Review{" +
                "rating=" + rating +
                ", content='" + content + '\'' +
                ", created_at=" + created_at +
                ", likes=" + likes +
                ", feedback='" + feedback + '\'' +
                ", productName=" + product.getName() +
                ", customerName=" + customer.getFullName() +
                '}';
    }
}

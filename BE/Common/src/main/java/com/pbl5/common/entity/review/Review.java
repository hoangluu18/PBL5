package com.pbl5.common.entity.review;

import com.pbl5.common.entity.Customer;
import com.pbl5.common.entity.IdBaseEntity;
import com.pbl5.common.entity.product.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "reviews")
@Getter
@Setter
public class Review extends IdBaseEntity {

    private int rating;
    private String content;
    private Date created_at;
    private int votes;
    private String feedback;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;


    @Transient
    private boolean isVotedByCurrentCustomer;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (!(o instanceof Review that)) return false;

        return Objects.equals(that.getId(), getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Review{" +
                "rating=" + rating +
                ", content='" + content + '\'' +
                ", created_at=" + created_at +
                ", votes=" + votes +
                ", feedback='" + feedback + '\'' +
                ", productName=" + product.getName() +
                ", customerName=" + customer.getFullName() +
                '}';
    }
}

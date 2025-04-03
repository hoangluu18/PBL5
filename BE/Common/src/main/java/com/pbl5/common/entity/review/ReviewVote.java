package com.pbl5.common.entity.review;

import com.pbl5.common.entity.Customer;
import com.pbl5.common.entity.IdBaseEntity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "reviews_votes")
@Data
public class ReviewVote extends IdBaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id")
    private Review review;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;
}

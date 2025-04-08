package com.pbl5.client.dto;

import com.pbl5.common.entity.Review;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class ProfileReviewDto {
    private Integer id;
    private int rating;
    private String content;
    private Date createdAt;
    private int likes;
    private String feedback;
    private Integer productId;
    private String productName;

    // Phương thức clone từ Review
    public void clone(Review review) {
        this.id = review.getId();
        this.rating = review.getRating();
        this.content = review.getContent();
        this.createdAt = review.getCreated_at();
        this.likes = review.getLikes();
        this.feedback = review.getFeedback();
        this.productId = review.getProduct() != null ? review.getProduct().getId() : null;
        this.productName = review.getProduct() != null ? review.getProduct().getName() : null;
    }
}
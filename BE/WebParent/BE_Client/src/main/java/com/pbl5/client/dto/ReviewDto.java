package com.pbl5.client.dto;

import com.pbl5.common.entity.Review;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class ReviewDto {

    private int rating;
    private String content;
    private Date created_at;
    private int likes;
    private String feedback;
    private String customerName;
    private String customerPhoto;

    public void clone(Review review){
        this.rating = review.getRating();
        this.content = review.getContent();
        this.created_at = review.getCreated_at();
        this.likes = review.getLikes();
        this.feedback = review.getFeedback();
        this.customerName = review.getCustomer().getFullName();
        this.customerPhoto = review.getCustomer().getAvatar();
    }
}

package com.pbl5.client.service;

import com.pbl5.client.dto.ProfileReviewDto;
import com.pbl5.client.dto.ReviewDto;
import com.pbl5.client.exception.ReviewNotFoundException;
import com.pbl5.common.entity.review.Review;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ReviewService {

    List<ProfileReviewDto> getReviewsByCustomerId(Integer customerId);

    Page<Review> getReviews(Integer productId, int page);

    void voteReview(Integer reviewId, Integer customerId) throws ReviewNotFoundException;


    void markReviewVote4ProductByCurrentCustomer(List<Review> reviews, Integer customerId, Integer productId);

    boolean getReviewByProductIdAndCustomerId(Integer productId, Integer customerId);

    Review save(Review review);
}

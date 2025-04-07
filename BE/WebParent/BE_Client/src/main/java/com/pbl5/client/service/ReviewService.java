package com.pbl5.client.service;

import com.pbl5.client.dto.ProfileReviewDto;
import com.pbl5.client.dto.ReviewDto;

import java.util.List;

public interface ReviewService {
    List<ReviewDto> getReviews(Integer productId);
    List<ProfileReviewDto> getReviewsByCustomerId(Integer customerId);
}

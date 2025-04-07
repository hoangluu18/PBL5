package com.pbl5.client.service.impl;

import com.pbl5.client.dto.ProfileReviewDto;
import com.pbl5.client.dto.ReviewDto;
import com.pbl5.client.repository.ReviewRepository;
import com.pbl5.client.service.ReviewService;
import com.pbl5.common.entity.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired private ReviewRepository reviewRepository;

    @Override
    public List<ReviewDto> getReviews(Integer productId){
        List<ReviewDto> res = new ArrayList<>();
        List<Review> reviews = reviewRepository.findAllByProductId(productId);

        reviews.forEach(r -> {
            ReviewDto reviewDto = new ReviewDto();
            reviewDto.clone(r);
            res.add(reviewDto);
        });

        return res;
    }

    @Override
    public List<ProfileReviewDto> getReviewsByCustomerId(Integer customerId) {
        List<ProfileReviewDto> res = new ArrayList<>();
        List<Review> reviews = reviewRepository.findAllByCustomerId(customerId);

        reviews.forEach(r -> {
            ProfileReviewDto reviewDto = new ProfileReviewDto();
            reviewDto.clone(r);
            res.add(reviewDto);
        });

        return res;
    }
}

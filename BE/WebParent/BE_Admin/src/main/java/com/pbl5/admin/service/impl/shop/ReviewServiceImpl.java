package com.pbl5.admin.service.impl.shop;

import com.pbl5.admin.dto.shop.ReviewDto;
import com.pbl5.admin.repository.shop.ReviewRepository;
import com.pbl5.admin.service.shop.ReviewService;
import com.pbl5.client.common.Constants;
import com.pbl5.client.exception.ReviewNotFoundException;
import com.pbl5.common.entity.review.Review;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public Page<ReviewDto> getReviewsByProductId(Integer productId, int page) {
        Page<Review> reviews = reviewRepository.findAllByProductIdOrderByCreatedAtDesc(
                productId, PageRequest.of(page, Constants.REVIEWS_PER_PAGE)
        );

        // Chuyển đổi thành DTO và đặt các thuộc tính cần thiết...
        return reviews.map(review -> {
            ReviewDto dto = new ReviewDto();
            dto.setId(review.getId());
            dto.setProductId(review.getProduct().getId());
            dto.setCustomerName(review.getCustomer().getFullName());
            dto.setCustomerPhoto(review.getCustomer().getAvatar());
            dto.setRating(review.getRating());
            dto.setContent(review.getContent());
            dto.setCreated_at(review.getCreated_at());
            dto.setFeedback(review.getFeedback());
            dto.setVotes(review.getVotes());
            dto.setVotedByCurrentCustomer(review.isVotedByCurrentCustomer());

            return dto;
        });
    }

    @Override
    public Review addFeedbackToReview(Integer reviewId, String feedback) throws ReviewNotFoundException {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found with id: " + reviewId));

        review.setFeedback(feedback);
        return reviewRepository.save(review);
    }
}

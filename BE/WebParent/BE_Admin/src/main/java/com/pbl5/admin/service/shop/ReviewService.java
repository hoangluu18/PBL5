package com.pbl5.admin.service.shop;

import com.pbl5.admin.dto.shop.ReviewDto;
import com.pbl5.client.exception.ReviewNotFoundException;
import com.pbl5.common.entity.review.Review;
import org.springframework.data.domain.Page;

public interface ReviewService {
    Page<ReviewDto> getReviewsByProductId(Integer productId, int page);
    Review addFeedbackToReview(Integer reviewId, String feedback) throws ReviewNotFoundException;
    // Các phương thức khác...
}

package com.pbl5.admin.controller.shop;

import com.pbl5.admin.dto.shop.ReviewDto;
import com.pbl5.admin.dto.shop.ReviewFeedbackDto;
import com.pbl5.admin.service.shop.ReviewService;
import com.pbl5.client.common.Constants;
import com.pbl5.common.entity.review.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// ReviewController.java
@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(Constants.FE_ADMIN_URL)
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getReviewsByProductId(
            @PathVariable("productId") Integer productId,
            @RequestParam(value = "page", defaultValue = "0") int page
    ) {
        Page<ReviewDto> reviews = reviewService.getReviewsByProductId(productId, page);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/feedback")
    public ResponseEntity<?> addFeedback(@RequestBody ReviewFeedbackDto feedbackDto) {
        try {
            Review updatedReview = reviewService.addFeedbackToReview(
                    feedbackDto.getReviewId(), feedbackDto.getFeedback());

            ReviewDto responseDto = new ReviewDto();
            responseDto.setId(updatedReview.getId());
            responseDto.setProductId(updatedReview.getProduct().getId());
            responseDto.setCustomerName(updatedReview.getCustomer().getFullName());
            responseDto.setCustomerPhoto(updatedReview.getCustomer().getAvatar());
            responseDto.setRating(updatedReview.getRating());
            responseDto.setContent(updatedReview.getContent());
            responseDto.setCreated_at(updatedReview.getCreated_at());
            responseDto.setFeedback(updatedReview.getFeedback());
            responseDto.setVotes(updatedReview.getVotes());
            responseDto.setVotedByCurrentCustomer(updatedReview.isVotedByCurrentCustomer());


            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}

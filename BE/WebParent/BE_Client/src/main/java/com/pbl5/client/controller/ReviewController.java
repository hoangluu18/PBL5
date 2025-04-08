package com.pbl5.client.controller;


import com.pbl5.client.common.Constants;
import com.pbl5.client.dto.ReviewDto;
import com.pbl5.client.service.ReviewService;
import com.pbl5.common.entity.Customer;
import com.pbl5.common.entity.review.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import static com.pbl5.client.common.Constants.REVIEW_API_URI;

@RestController
@RequestMapping(REVIEW_API_URI)
@CrossOrigin(Constants.FE_URL)
public class ReviewController {

    @Autowired private ReviewService reviewService;

    @GetMapping("/{pid}")
    public ResponseEntity<?> getReviews(@PathVariable("pid") Integer pid,
                                        @RequestParam(value = "page", defaultValue = "1") int page) {

        // get user exists
        Customer customer = new Customer();
        customer.setId(5);

        Page<Review> reviewPage = reviewService.getReviews(pid, page - 1);
        List<Review> reviews = reviewPage.getContent();
        if(customer != null){
            reviewService.markReviewVote4ProductByCurrentCustomer(reviews, customer.getId(), pid);
        }

        List<ReviewDto> reviewDtos = new ArrayList<>();
        reviews.forEach(review -> {
            ReviewDto reviewDto = new ReviewDto();
            reviewDto.clone(review);
            reviewDtos.add(reviewDto);
        });

        return ResponseEntity.ok(reviewDtos);
    }

        @PostMapping("/vote_review")
        public ResponseEntity<?> voteReview(@RequestParam("reviewId") Integer reviewId,
                                             @RequestParam("customerId") Integer customerId){
            try {
                reviewService.voteReview(reviewId, customerId);
                return ResponseEntity.ok().build();
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }

}

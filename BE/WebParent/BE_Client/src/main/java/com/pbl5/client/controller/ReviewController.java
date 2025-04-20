package com.pbl5.client.controller;


import com.pbl5.client.common.Constants;
import com.pbl5.client.dto.ReviewDto;
import com.pbl5.client.dto.ReviewRequestDto;
import com.pbl5.client.service.OrderDetailService;
import com.pbl5.client.service.ReviewService;
import com.pbl5.common.entity.Customer;
import com.pbl5.common.entity.OrderDetail;
import com.pbl5.common.entity.product.Product;
import com.pbl5.common.entity.review.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static com.pbl5.client.common.Constants.REVIEW_API_URI;
import static org.springframework.http.ResponseEntity.badRequest;

@RestController
@RequestMapping(REVIEW_API_URI)
@CrossOrigin(Constants.FE_URL)
public class ReviewController {

    @Autowired private ReviewService reviewService;
    
    @Autowired private OrderDetailService orderDetailService;

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

    @PostMapping("/vote-review")
    public ResponseEntity<?> voteReview(@RequestParam("reviewId") Integer reviewId,
                                         @RequestParam("customerId") Integer customerId){
        try {
            reviewService.voteReview(reviewId, customerId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/check-review")
    public ResponseEntity<String> checkReview(@RequestParam("productId") Integer productId,
                                         @RequestParam("customerId") Integer customerId){
        boolean isReviewed = reviewService.getReviewByProductIdAndCustomerId(productId, customerId);
        OrderDetail orderDetail = orderDetailService.checkByProductIdAndCustomerIdWithStatusDelivered(productId, customerId);
        if (orderDetail == null) {
            return ResponseEntity.ok("Bạn chưa mua sản phẩm này");
        } else if (isReviewed) {
            return ResponseEntity.ok("Bạn đã đánh giá sản phẩm này");
        } else {
            return ResponseEntity.ok("Bạn có thể đánh giá sản phẩm này");
            
        }
    }

    @PostMapping("/submit-review")
    public ResponseEntity<?> saveReview(@RequestBody ReviewRequestDto reviewRequestDto) {
        try {
            Review review = new Review();
            review.setCustomer(new Customer(reviewRequestDto.getCustomerId()));
            review.setProduct(new Product(reviewRequestDto.getProductId()));
            review.setRating(reviewRequestDto.getRating());
            review.setContent(reviewRequestDto.getContent());
            review.setCreated_at(new Date());
            review.setVotes(0);

            Review savedReview = reviewService.save(review);
            return ResponseEntity.ok().body(savedReview);
        } catch (Exception e) {
            return badRequest().body(e.getMessage());
        }
    }
}

package com.pbl5.client.service.impl;

import com.pbl5.client.dto.ProfileReviewDto;
import com.pbl5.client.dto.ReviewDto;
import com.pbl5.client.common.Constants;
import com.pbl5.client.exception.ReviewNotFoundException;
import com.pbl5.client.repository.CustomerRepository;
import com.pbl5.client.repository.ReviewRepository;
import com.pbl5.client.repository.ReviewVoteRepository;
import com.pbl5.client.service.ReviewService;
import com.pbl5.common.entity.Customer;
import com.pbl5.common.entity.review.Review;
import com.pbl5.common.entity.review.ReviewVote;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {

    @Autowired private ReviewRepository reviewRepository;

    @Autowired private ReviewVoteRepository reviewVoteRepository;

    @Autowired private CustomerRepository customerRepository;

    @Override
    public Page<Review> getReviews(Integer productId, int page) {

        return reviewRepository.findAllByProductId(productId, PageRequest.of(page, Constants.REVIEWS_PER_PAGE));
    }

    @Override
    public void voteReview(Integer reviewId, Integer customerId) throws ReviewNotFoundException {

        ReviewVote reviewVote = reviewVoteRepository.findByReviewAndCustomer(reviewId, customerId);

        if(reviewVote == null){
            reviewVote = new ReviewVote();

            Review review = reviewRepository.findById(reviewId)
                    .orElseThrow(() -> new ReviewNotFoundException("Review not found with id: " + reviewId));
            Customer customer = customerRepository.findById(customerId)
                    .orElseThrow(() -> new ReviewNotFoundException("Customer not found with id: " + customerId));

            reviewVote.setReview(review);
            reviewVote.setCustomer(customer);

            reviewVoteRepository.save(reviewVote);
            reviewRepository.updateVoteCount(reviewId);
        } else {
            reviewVoteRepository.delete(reviewVote);
            reviewRepository.updateVoteCount(reviewId);
        }

    }

    @Override
    public void markReviewVote4ProductByCurrentCustomer(List<Review> reviews, Integer customerId, Integer productId) {

        List<ReviewVote> reviewVotes = reviewVoteRepository.findByProductAndCustomer(productId, customerId);

        reviewVotes.forEach(reviewVote -> {
            Review votedReview = reviewVote.getReview();

            if(reviews.contains(votedReview)){
                int idx = reviews.indexOf(votedReview);
                Review review = reviews.get(idx);

                review.setVotedByCurrentCustomer(true);
            }
        });

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

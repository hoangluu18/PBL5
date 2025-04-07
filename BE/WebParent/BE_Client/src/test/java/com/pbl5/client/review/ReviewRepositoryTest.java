package com.pbl5.client.review;

import com.pbl5.client.repository.ReviewRepository;
import com.pbl5.client.repository.ReviewVoteRepository;
import com.pbl5.common.entity.review.Review;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.annotation.Rollback;

import java.util.List;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
public class ReviewRepositoryTest {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired private ReviewVoteRepository reviewVoteRepository;

    @Test
    public void testGetByProductId(){
        Page<Review> reviews = reviewRepository.findAllByProductId(9, PageRequest.of(0, 10));
        System.out.println(reviews.getContent().size());
    }

    @Test
    public void updateReviewVoteCount() {
        reviewRepository.updateVoteCount(11);
    }

    @Test
    public void testFindByReviewIdAndCustomerId() {
        int reviewId = 11;
        int customerId = 5;
        var reviewVote = reviewVoteRepository.findByReviewAndCustomer(reviewId, customerId);
        System.out.println(reviewVote.getReview().getContent());
    }

    @Test
    public void testFindByProductIdAndCustomerId() {
        int productId = 9;
        int customerId = 5;
        var reviewVoteList = reviewVoteRepository.findByProductAndCustomer(productId, customerId);
        System.out.println(reviewVoteList.size());
    }
}

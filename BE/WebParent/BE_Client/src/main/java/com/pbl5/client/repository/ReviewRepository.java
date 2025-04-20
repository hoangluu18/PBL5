package com.pbl5.client.repository;

import com.pbl5.common.entity.review.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    List<Review> findAllByCustomerId(Integer customerId);
  
    @Query("SELECT r FROM Review r WHERE r.product.id = ?1")
    public Page<Review> findAllByProductId(Integer productId, Pageable pageable);

    @Query("UPDATE Review r SET r.votes = (SELECT COUNT(*) FROM ReviewVote rv WHERE rv.review.id = ?1) " +
            "WHERE r.id = ?1")
    @Modifying
    public void updateVoteCount(Integer reviewId);

    @Query("SELECT r FROM Review r WHERE r.product.id = ?1 AND r.customer.id = ?2")
    Review findByProductIdAndCustomerId(Integer productId, Integer customerId);

}

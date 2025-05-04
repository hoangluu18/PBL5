package com.pbl5.admin.repository.shop;

import com.pbl5.common.entity.review.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    @Query("SELECT r FROM Review r WHERE r.product.id = :productId ORDER BY r.created_at DESC")
    Page<Review> findAllByProductIdOrderByCreatedAtDesc(Integer productId, Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.product.id = :productId AND r.feedback IS NULL")
    List<Review> findReviewsWithoutFeedback(Integer productId);
}
package com.pbl5.client.repository;

import com.pbl5.common.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    @Query("SELECT r FROM Review r WHERE r.product.id = ?1")
    public List<Review> findAllByProductId(Integer productId);

    List<Review> findAllByCustomerId(Integer customerId);
}

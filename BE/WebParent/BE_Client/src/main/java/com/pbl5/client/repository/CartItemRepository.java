package com.pbl5.client.repository;

import com.pbl5.common.entity.CartItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItems, Long> {
    List<CartItems> findByCustomerId(Integer customerId);

    @Query("SELECT ci FROM CartItems ci WHERE ci.customer.id = ?1 AND ci.product.id = ?2 AND ci.productDetail = ?3")
    CartItems findByCustomerIdAndProductIdWithDetail(Integer customerId, Integer productId, String detail);

    @Query("SELECT COUNT(ci) FROM CartItems ci WHERE ci.customer.id = ?1")
    Integer countProductsByCustomerId(Integer customerId);
}

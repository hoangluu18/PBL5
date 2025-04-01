package com.pbl5.client.repository;

import com.pbl5.common.entity.CartItems;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItems, Long> {
    List<CartItems> findByCustomerId(Integer customerId);
    Optional<CartItems> findByCustomerIdAndProductId(Integer customerId, Integer productId);
}

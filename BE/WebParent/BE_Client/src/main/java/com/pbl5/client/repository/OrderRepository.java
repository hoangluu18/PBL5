package com.pbl5.client.repository;

import com.pbl5.common.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Query("SELECT o FROM Order o WHERE o.customer.id = ?1")
    public List<Order> findByCustomerId(Integer customerId);
}

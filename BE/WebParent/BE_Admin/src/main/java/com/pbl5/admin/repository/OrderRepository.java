package com.pbl5.admin.repository;

import com.pbl5.common.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT SUM(o.total) FROM Order o WHERE o.customerId = :customerId AND o.orderStatus = 'DELIVERED'")
    Double
    calculateTotalSpendingByCustomerId(@Param("customerId") Integer customerId);
}

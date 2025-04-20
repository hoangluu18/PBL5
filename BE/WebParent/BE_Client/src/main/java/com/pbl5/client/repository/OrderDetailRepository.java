package com.pbl5.client.repository;

import com.pbl5.common.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    List<OrderDetail> findAllByOrderId(Integer orderId);
    @Query("SELECT od FROM OrderDetail od WHERE od.order.id = ?1 AND od.order.customerId = ?2")
    List<OrderDetail> findAllByOrderIdAndCustomerId(Integer orderId, Integer customerId);

    @Query("SELECT od FROM OrderDetail od WHERE od.product.id = ?1 AND od.order.customerId = ?2" +
            " AND od.order.orderStatus = 'DELIVERED'")
    OrderDetail findByProductIdAndCustomerIdWithStatusDelivered(Integer productId, Integer customerId);
}
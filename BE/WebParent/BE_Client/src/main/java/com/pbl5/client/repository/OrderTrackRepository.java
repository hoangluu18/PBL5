package com.pbl5.client.repository;

import com.pbl5.common.entity.Order;
import com.pbl5.common.entity.OrderTrack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.Optional;

@Repository
public interface OrderTrackRepository extends JpaRepository<OrderTrack, Integer> {
    @Query("SELECT ot FROM OrderTrack ot WHERE ot.order.id = :orderId AND ot.status = :status")
    Optional<OrderTrack> findByOrderIdAndStatus(@Param("orderId") Integer orderId, @Param("status") OrderTrack.OrderStatus status);

    // Truy vấn native để lấy thời gian giao hàng
    @Query(value = "SELECT updated_time FROM order_track " +
            "WHERE order_id = :orderId AND status = 'DELIVERED' " +
            "ORDER BY updated_time DESC LIMIT 1",
            nativeQuery = true)
    Date findDeliveryTimeByOrderId(@Param("orderId") Integer orderId);

    Optional<OrderTrack> findByOrderAndStatus(Order order, OrderTrack.OrderStatus orderStatus);
}
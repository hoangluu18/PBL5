package com.pbl5.client.repository.payment;

import com.pbl5.common.entity.Order;
import com.pbl5.common.entity.Escrow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EscrowRepository extends JpaRepository<Escrow, Integer> {

    List<Escrow> findByOrder(Order order);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT e FROM Escrow e WHERE e.id = :id")
    Optional<Escrow> findByIdWithLock(@Param("id") Integer id);

    // Sử dụng native query để tránh lỗi JOIN
    @Query(value = "SELECT e.id FROM escrows e " +
            "JOIN orders o ON e.order_id = o.id " +
            "WHERE e.status = 'HOLDING' AND o.order_status = 'DELIVERED'",
            nativeQuery = true)
    List<Integer> findPendingReleaseEscrowIdsNative();

    @Query(value = "SELECT o.id FROM escrows e " +
            "JOIN orders o ON e.order_id = o.id " +
            "WHERE e.status = 'HOLDING' AND o.order_status = 'DELIVERED'",
            nativeQuery = true)
    List<Integer> findPendingOrderIdsNative();

    @Query(value = "SELECT `id`, `amount`, `created_at`, `released_at`, `status`, `customer_wallet_id`, `order_id`, `shop_wallet_id` FROM `escrows` WHERE escrows.order_id = :id", nativeQuery = true)
    Escrow findEscrowById(@Param("id") Integer id);


    List<Escrow> findAllByStatus(Escrow.EscrowStatus escrowStatus);

    @Query("SELECT e.status FROM Escrow e WHERE e.order.id = :id")
    String findStatusById(@Param("id") Integer id);
}
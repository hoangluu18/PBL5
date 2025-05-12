package com.pbl5.admin.repository.payment;


import com.pbl5.common.entity.Escrow;
import com.pbl5.common.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

public interface EscrowRepository extends JpaRepository<Escrow, Integer> {

    Optional<Escrow> findByOrder(Order order);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT e FROM Escrow e WHERE e.id = :id")
    Optional<Escrow> findByIdWithLock(@Param("id") Integer id);

    @Query("SELECT e FROM Escrow e WHERE e.status = 'HOLDING' AND e.order.orderStatus = 'DELIVERED'")
    List<Escrow> findPendingReleaseEscrows();
}

package com.pbl5.client.repository;

import com.pbl5.common.entity.OrderTrack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderTrackRepository extends JpaRepository<OrderTrack, Integer> {
}
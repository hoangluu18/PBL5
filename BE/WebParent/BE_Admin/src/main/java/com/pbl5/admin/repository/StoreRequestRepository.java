package com.pbl5.admin.repository;

import com.pbl5.common.entity.StoreRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreRequestRepository extends JpaRepository<StoreRequest, Integer> {
}

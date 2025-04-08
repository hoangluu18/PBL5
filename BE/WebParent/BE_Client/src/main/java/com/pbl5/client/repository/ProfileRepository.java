package com.pbl5.client.repository;

import com.pbl5.common.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Customer, Long> {
}
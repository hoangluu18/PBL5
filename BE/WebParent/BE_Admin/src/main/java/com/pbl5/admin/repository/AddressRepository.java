package com.pbl5.admin.repository;

import com.pbl5.common.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Integer> {
    List<Address> findByCustomerIdAndEnable(Integer customerId, boolean enable);
}

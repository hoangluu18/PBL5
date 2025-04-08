package com.pbl5.client.repository;

import com.pbl5.common.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByCustomerId(Integer customerId);

    @Query("SELECT a FROM Address a WHERE a.customerId = :customerId AND a.isDefault = true")
    Optional<Address> findDefaultAddressByCustomerId(Integer customerId);
}
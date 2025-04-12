package com.pbl5.client.repository;

import com.pbl5.common.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    @Query("SELECT a FROM Address a WHERE a.customerId = :customerId AND a.enable = true")
    List<Address> findEnabledByCustomerId(@Param("customerId") Integer customerId);

    @Query("SELECT a FROM Address a WHERE a.customerId = :customerId AND a.isDefault = true")
    Optional<Address> findDefaultAddressByCustomerId(Integer customerId);
}
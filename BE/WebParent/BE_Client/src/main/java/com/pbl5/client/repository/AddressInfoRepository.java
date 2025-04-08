package com.pbl5.client.repository;

import com.pbl5.common.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AddressInfoRepository extends JpaRepository<Address, Integer> {
    @Query("select s from Address s where s.customerId = :id and s.isDefault = true")
    Address fineByAddressDefault(int id);
}

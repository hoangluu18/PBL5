package com.pbl5.admin.repository;

import com.pbl5.common.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    @Query("SELECT DISTINCT c FROM Customer c JOIN Order o ON c.id = o.customer.id WHERE o.shop.id = :shopId")
    List<Customer> findDistinctByOrdersShopId(@Param("shopId") Integer shopId);
}
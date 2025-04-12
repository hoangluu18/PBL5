package com.pbl5.client.repository;

import com.pbl5.common.entity.Order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Query("SELECT o FROM Order o WHERE o.customer.id = ?1")
    public List<Order> findByCustomerId(Integer customerId);

//    // Phương thức hiện có
//    List<Order> findByCustomerId(Integer customerId);

    // Thêm phương thức phân trang
    Page<Order> findByCustomerId(Integer customerId, Pageable pageable);

    @Query("SELECT SUM(o.total) FROM Order o WHERE o.customerId = :customerId AND o.shopId = :shopId")
    Double getTotalSpentByCustomerIdAndShopId(Integer customerId, Integer shopId);

    @Query("SELECT SUM(o.total) FROM Order o WHERE o.customerId = :customerId")
    Double getTotalSpentByCustomerId(Integer customerId);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.customerId = :customerId")
    Integer getTotalOrderByCustomerId(Integer customerId);

    @Query("SELECT MAX(o.orderTime) FROM Order o WHERE o.customerId = :customerId")
    Date getLastOrderByCustomerId(Integer customerId);

    @Query("SELECT MAX(o.orderTime) FROM Order o WHERE o.customerId = :customerId AND o.shopId = :shopId")
    Date getLastOrderByCustomerIdAndShopId(Integer customerId, Integer shopId);

    List<Order> findByCustomerIdAndShopId(Integer customerId, Integer shopId);

}


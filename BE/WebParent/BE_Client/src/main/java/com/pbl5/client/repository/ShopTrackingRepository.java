package com.pbl5.client.repository;

import com.pbl5.common.entity.Shop;
import com.pbl5.common.entity.ShopTracking;
import com.pbl5.common.entity.product.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ShopTrackingRepository extends JpaRepository<ShopTracking, Integer> {
    @Query("SELECT s.shop.id FROM ShopTracking s WHERE s.customer.id = :customerId")
    public Page<Integer>findAll(Pageable pageable, int customerId);
}

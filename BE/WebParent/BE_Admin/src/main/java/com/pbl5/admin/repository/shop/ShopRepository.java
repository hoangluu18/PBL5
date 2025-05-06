package com.pbl5.admin.repository.shop;

import com.pbl5.common.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShopRepository extends JpaRepository<Shop, Integer> {
    Optional<Shop> findByUserId(int userId);
    Optional<Shop> findById(int id);
    List<Shop> findAll();
    void deleteById(int id);
    Shop save(Shop shop);
}

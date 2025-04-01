package com.pbl5.client.repository;

import com.pbl5.common.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Integer> {
    public Optional<Shop> findById(Integer id);
}

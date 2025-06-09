package com.pbl5.admin.repository.shop;

import com.pbl5.common.entity.Shop;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Integer> {

    @Query("UPDATE Shop s SET s.enabled = ?2 WHERE s.id = ?1")
    @Modifying
    void updateEnabledById(int id, boolean enabled);

    @Query("SELECT s FROM Shop s WHERE s.name LIKE %:searchText% OR s.description LIKE %:searchText%")
    Page<Shop> findAll(Pageable pageable, String searchText);
    Optional<Shop> findByUserId(int userId);
    Optional<Shop> findById(int id);
    List<Shop> findAll();
    void deleteById(int id);
    Shop save(Shop shop);

    @Query("SELECT s.id FROM Shop s WHERE s.user.id = :userId")
    int findShopIdByUserId(int userId);
}

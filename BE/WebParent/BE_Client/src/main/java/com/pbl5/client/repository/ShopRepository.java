package com.pbl5.client.repository;

import com.pbl5.common.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Integer> {
    public Optional<Shop> findById(Integer id);

    @Modifying
    @Query("UPDATE Shop s SET s.peopleTracking = (SELECT COUNT(*) FROM ShopTracking st WHERE st.shop.id = s.id) WHERE s.id = :shopId")
    void updatePeopleTracking(@Param("shopId") int shopId);
}

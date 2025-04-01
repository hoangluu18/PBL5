package com.pbl5.client.repository;

import com.pbl5.common.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopInfoRepository extends JpaRepository <Shop, Integer> {

}

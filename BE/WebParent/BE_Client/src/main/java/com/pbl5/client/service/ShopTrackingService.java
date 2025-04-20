package com.pbl5.client.service;

import com.pbl5.common.entity.ShopTracking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ShopTrackingService {
    Page<Integer> findAll(int customerId, int page);
    boolean existsShopTrackingByCustomerId(int customerId, int shopId);

    boolean saveFollowingShop(int customerId, int shopId);

    boolean deleteFollowingShop(int customerId, int shopId);

}

package com.pbl5.client.service;

import com.pbl5.common.entity.Shop;

import java.util.List;

public interface ShopService {
    Shop findById(Integer id);
    List<Shop> findByListId(List<Integer> ids);

    boolean updatePeopleTracking(int shopId);
}

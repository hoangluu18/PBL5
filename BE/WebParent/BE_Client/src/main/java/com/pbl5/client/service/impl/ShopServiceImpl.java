package com.pbl5.client.service.impl;

import com.pbl5.client.repository.ShopRepository;
import com.pbl5.client.service.ShopService;
import com.pbl5.common.entity.Shop;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShopServiceImpl implements ShopService {
    @Autowired
    private ShopRepository shopRepository;
    @Override
    public Shop findById(Integer id) {
        return shopRepository.findById(id).orElse(null);
    }

    @Override
    public List<Shop> findByListId(List<Integer> ids) {
        List<Shop> shops = shopRepository.findAllById(ids);
        return shops;
    }

    @Override
    public boolean updatePeopleTracking(int shopId) {
        shopRepository.updatePeopleTracking(shopId);
        return true;
    }
}

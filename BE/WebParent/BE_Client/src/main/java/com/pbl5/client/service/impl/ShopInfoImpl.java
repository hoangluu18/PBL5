package com.pbl5.client.service.impl;

import com.pbl5.client.repository.ShopInfoRepository;
import com.pbl5.client.repository.UserRepository;
import com.pbl5.client.service.ShopInfoService;
import com.pbl5.common.entity.Shop;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ShopInfoImpl implements ShopInfoService {
    @Autowired
    private ShopInfoRepository shopInfoRepository;

    @Autowired
    private UserRepository userRepository;
    @Override
    public Shop getById(Integer id) {

        return shopInfoRepository.findById(id).orElse(null);
    }

    @Override
    public String findEmailById(Integer id) {
        return userRepository.findEmailById(id).getEmail();
    }

}

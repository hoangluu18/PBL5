package com.pbl5.client.service;

import com.pbl5.client.repository.ShopInfoRepository;
import com.pbl5.common.entity.Shop;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


public interface ShopInfoService {
    Shop getById(Integer id);
    String findEmailById(Integer id);
}

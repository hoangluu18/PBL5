package com.pbl5.client.service.impl;

import com.pbl5.client.common.Constants;
import com.pbl5.client.repository.ShopTrackingRepository;
import com.pbl5.client.service.ShopTrackingService;
import com.pbl5.common.entity.ShopTracking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.pbl5.client.common.Constants.FOLLOWING_SHOPS_PER_PAGE;

@Service
public class ShopTrackingImpl implements ShopTrackingService {
    @Autowired
    private ShopTrackingRepository shopTrackingRepository;


    @Override
    public Page<Integer> findAll(int customerId, int page) {
        Pageable pageable = PageRequest.of(page, FOLLOWING_SHOPS_PER_PAGE);
        return shopTrackingRepository.findAll(pageable, customerId);
    }


}

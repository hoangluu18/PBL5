package com.pbl5.client.service.impl;

import com.pbl5.client.common.Constants;
import com.pbl5.client.repository.ShopTrackingRepository;
import com.pbl5.client.service.ShopInfoService;
import com.pbl5.client.service.ShopService;
import com.pbl5.client.service.ShopTrackingService;
import com.pbl5.common.entity.Customer;
import com.pbl5.common.entity.Shop;
import com.pbl5.common.entity.ShopTracking;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.pbl5.client.common.Constants.FOLLOWING_SHOPS_PER_PAGE;

@Service
@Transactional
public class ShopTrackingImpl implements ShopTrackingService {
    @Autowired
    private ShopTrackingRepository shopTrackingRepository;

    @Autowired
    private ShopService shopService;

    @Override
    public Page<Integer> findAll(int customerId, int page) {
        Pageable pageable = PageRequest.of(page, FOLLOWING_SHOPS_PER_PAGE);
        return shopTrackingRepository.findAll(pageable, customerId);
    }

    @Override
    public boolean existsShopTrackingByCustomerId(int customerId, int shopId) {
        return shopTrackingRepository.existsShopTrackingByCustomerId(shopId, customerId);
    }

    @Override
    public boolean saveFollowingShop(int customerId, int shopId) {
        if(shopTrackingRepository.existsShopTrackingByCustomerId(shopId, customerId)) {
            return false;
        }

        try {
            // Create a new ShopTracking entity instead of using the invalid query
            ShopTracking shopTracking = new ShopTracking();

            Customer customer = new Customer();
            customer.setId(customerId);

            Shop shop = new Shop();
            shop.setId(shopId);

            shopTracking.setCustomer(customer);
            shopTracking.setShop(shop);

            shopTrackingRepository.save(shopTracking);
            shopService.updatePeopleTracking(shopId);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean deleteFollowingShop(int customerId, int shopId) {
        try {
            shopTrackingRepository.deleteByCustomerIdAndShopId(customerId, shopId);
            shopService.updatePeopleTracking(shopId);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }



}

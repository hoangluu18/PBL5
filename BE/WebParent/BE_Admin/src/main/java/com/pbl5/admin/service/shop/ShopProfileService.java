package com.pbl5.admin.service.shop;

import com.pbl5.admin.dto.shop.ShopProfileDto;

public interface ShopProfileService {
    ShopProfileDto getShopProfileByUserId(int userId);
    ShopProfileDto updateShopProfile(ShopProfileDto shopProfileDto);
    void updateShopPhoto(int shopId, String photoUrl);
}
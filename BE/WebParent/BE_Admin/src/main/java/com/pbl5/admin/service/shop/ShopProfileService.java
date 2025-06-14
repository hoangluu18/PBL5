package com.pbl5.admin.service.shop;

import com.pbl5.admin.dto.shop.ShopProfileDto;
import com.pbl5.common.entity.Wallet;

public interface ShopProfileService {
    ShopProfileDto getShopProfileByUserId(int userId);
    ShopProfileDto updateShopProfile(ShopProfileDto shopProfileDto);
    void updateShopPhoto(int shopId, String photoUrl);
    int getShopIdByUserId(int userId);

    Wallet getShopWallet(Integer shopId);
}
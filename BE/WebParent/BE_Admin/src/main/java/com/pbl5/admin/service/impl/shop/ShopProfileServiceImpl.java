package com.pbl5.admin.service.impl.shop;

import com.pbl5.admin.dto.shop.ShopProfileDto;
import com.pbl5.admin.repository.payment.WalletRepository;
import com.pbl5.admin.service.shop.ShopProfileService;
import com.pbl5.common.entity.Shop;
import com.pbl5.common.entity.User;
import com.pbl5.admin.repository.shop.ShopRepository;
import com.pbl5.admin.repository.UserRepository;
import com.pbl5.common.entity.Wallet;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
@Transactional
public class ShopProfileServiceImpl implements ShopProfileService {

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Override
    public ShopProfileDto getShopProfileByUserId(int userId) {
        Optional<Shop> shopOpt = shopRepository.findByUserId(userId);
        if (!shopOpt.isPresent()) {
            throw new RuntimeException("Shop not found for user ID: " + userId);
        }

        Shop shop = shopOpt.get();
        return mapToDto(shop);
    }

    @Override
    public ShopProfileDto updateShopProfile(ShopProfileDto shopProfileDto) {
        Optional<Shop> shopOpt = shopRepository.findById(shopProfileDto.getId());
        if (!shopOpt.isPresent()) {
            throw new RuntimeException("Shop not found with ID: " + shopProfileDto.getId());
        }

        Shop shop = shopOpt.get();
        shop.setName(shopProfileDto.getName());
        shop.setDescription(shopProfileDto.getDescription());
        shop.setAddress(shopProfileDto.getAddress());
        shop.setPhone(shopProfileDto.getPhone());
        shop.setCity(shopProfileDto.getCity());
        shop.setUpdatedAt(new Date());

        Shop updatedShop = shopRepository.save(shop);
        return mapToDto(updatedShop);
    }

    @Override
    public void updateShopPhoto(int shopId, String photoUrl) {
        Optional<Shop> shopOpt = shopRepository.findById(shopId);
        if (!shopOpt.isPresent()) {
            throw new RuntimeException("Shop not found with ID: " + shopId);
        }

        Shop shop = shopOpt.get();
        shop.setPhoto(photoUrl);
        shop.setUpdatedAt(new Date());

        shopRepository.save(shop);
    }

    @Override
    public int getShopIdByUserId(int userId) {
        int shopId = shopRepository.findShopIdByUserId(userId);
        if (shopId <= 0) {
            throw new RuntimeException("Shop not found for user ID: " + userId);
        }
        return shopId;
    }

    @Override
    public Wallet getShopWallet(Integer shopId) {
        Optional<Shop> shopOpt = shopRepository.findById(shopId);
        if (!shopOpt.isPresent()) {
            throw new RuntimeException("Shop not found with ID: " + shopId);
        }

        Shop shop = shopOpt.get();
        User user = shop.getUser();
        if (user == null) {
            throw new RuntimeException("User not found for shop ID: " + shopId);
        }

        // Tìm ví theo userId
        Optional<Wallet> walletOpt = walletRepository.findByUserId(user.getId());
        if (!walletOpt.isPresent()) {
            throw new RuntimeException("Wallet not found for shop ID: " + shopId);
        }

        return walletOpt.get();
    }

    private ShopProfileDto mapToDto(Shop shop) {
        ShopProfileDto dto = new ShopProfileDto();
        dto.setId(shop.getId());
        dto.setName(shop.getName());
        dto.setDescription(shop.getDescription());
        dto.setAddress(shop.getAddress());
        dto.setPhone(shop.getPhone());
        dto.setPhoto(shop.getPhoto());
        dto.setPeopleTracking(shop.getPeopleTracking());
        dto.setCity(shop.getCity());
        dto.setProductAmount(shop.getProductAmount());
        dto.setRating(shop.getRating());
        dto.setCreatedAt(shop.getCreatedAt());
        dto.setUpdatedAt(shop.getUpdatedAt());
        dto.setEnabled(shop.isEnabled());
        dto.setUserId(shop.getUser().getId());

        return dto;
    }
}
package com.pbl5.client.controller;

import com.pbl5.client.dto.ShopDto;
import com.pbl5.client.dto.ShopTrackingDto;
import com.pbl5.client.service.ShopService;
import com.pbl5.client.service.ShopTrackingService;
import com.pbl5.common.entity.Shop;
import com.pbl5.common.entity.ShopTracking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/shop-tracking")
@CrossOrigin(origins = "http://localhost:5173")
public class ShopTrackingController {
     @Autowired
     private ShopTrackingService shopTrackingService;
     @Autowired
     private ShopService shopService;

    @GetMapping
    public ResponseEntity<List<ShopTrackingDto>> listShopTracking(@RequestParam int customerId,
                                                          @RequestParam(name = "pageNum", defaultValue = "1") int pageNum) {

        List<ShopTrackingDto> shopDtos = new ArrayList<>();
        if (pageNum < 1) {
            pageNum = 1;
        }
        List<Integer> shops = shopTrackingService.findAll(customerId,pageNum - 1 ).getContent();
        System.out.println("shops: " + shops);
        shops.forEach(s -> {
            ShopTrackingDto dto = new ShopTrackingDto();
            Shop shop = shopService.findById(s);
            dto.setShopId(shop.getId());
            dto.setShopName(shop.getName());
            dto.setPhoto(shop.getPhoto());
            dto.setRating(shop.getRating().toString());
            dto.setPeopleTracking(shop.getPeopleTracking().toString());
            shopDtos.add(dto);
        });
        return ResponseEntity.ok(shopDtos);
    }

}

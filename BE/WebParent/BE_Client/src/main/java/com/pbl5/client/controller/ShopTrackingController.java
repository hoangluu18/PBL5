package com.pbl5.client.controller;

import com.pbl5.client.dto.ShopTrackingDto;
import com.pbl5.client.repository.OrderRepository;
import com.pbl5.client.service.ShopService;
import com.pbl5.client.service.ShopTrackingService;
import com.pbl5.common.entity.Shop;
import com.pbl5.common.entity.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/shop-tracking")
@CrossOrigin(origins = "http://localhost:5173")
public class ShopTrackingController {

    @Autowired
    private ShopTrackingService shopTrackingService;

    @Autowired
    private ShopService shopService;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public ResponseEntity<List<ShopTrackingDto>> listShopTracking(
            @RequestParam int customerId,
            @RequestParam(name = "pageNum", defaultValue = "1") int pageNum
    ) {
        if (pageNum < 1) {
            pageNum = 1;
        }

        List<Integer> shopIds = shopTrackingService.findAll(customerId, pageNum - 1).getContent();
        List<ShopTrackingDto> shopDtos = new ArrayList<>();

        for (Integer shopId : shopIds) {
            Shop shop = shopService.findById(shopId);
            if (shop != null) {
                ShopTrackingDto dto = new ShopTrackingDto();
                dto.setShopId(shop.getId());
                dto.setShopName(shop.getName());
                dto.setPhoto(shop.getPhoto());
                dto.setRating(shop.getRating() != null ? shop.getRating().toString() : "0");
                dto.setPeopleTracking(shop.getPeopleTracking() != null ? shop.getPeopleTracking().toString() : "0");

                // Thêm thông tin tổng số đơn hàng của customer với shop này
                int totalOrders = orderRepository.findByCustomerIdAndShopId(customerId, shopId).size();
                dto.setTotalOrders(totalOrders);

                // Thêm thông tin tổng chi tiêu của customer với shop này
                Double totalSpent = orderRepository.getTotalSpentByCustomerIdAndShopId(customerId, shopId);
                dto.setTotalSpent(totalSpent != null ? totalSpent : 0.0);

                // Thêm thông tin thời gian đơn hàng gần nhất của customer với shop này
                Date lastOrder = orderRepository.getLastOrderByCustomerIdAndShopId(customerId, shopId);
                dto.setLastOrder(lastOrder != null ? lastOrder.toString() : "N/A");

                shopDtos.add(dto);
            }
        }

        return ResponseEntity.ok(shopDtos);
    }
}

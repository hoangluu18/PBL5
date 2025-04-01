package com.pbl5.client.controller;

import com.pbl5.client.dto.product.ProductDto;
import com.pbl5.client.dto.shop_detail.ShopInfoDto;
import com.pbl5.client.service.ProductService;
import com.pbl5.client.service.ShopInfoService;
import com.pbl5.common.entity.Shop;
import com.pbl5.common.entity.product.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shop")
@CrossOrigin(origins = "http://localhost:5173")
public class ShopInfoController {
    @Autowired
    private ShopInfoService shopInfoService;

    @Autowired
    private ProductService productService;

    @GetMapping({"/{id}/shopInfo"})
    public ResponseEntity<ShopInfoDto> getShopInfo(@PathVariable int id) {
        //shop info
        Shop shop = shopInfoService.getById(id);
        String email = shopInfoService.findEmailById(id);
        ShopInfoDto shopInfoDto = new ShopInfoDto();
        shopInfoDto.setId(shop.getId());
        shopInfoDto.setName(shop.getName());
        shopInfoDto.setEmail(email);
        shopInfoDto.setAddress(shop.getAddress());
        shopInfoDto.setPhone(shop.getPhone());
        shopInfoDto.setDescription(shop.getDescription());
        shopInfoDto.setPhoto(shop.getPhoto());
        shopInfoDto.setCreatedAt(shop.getCreatedAt());
        shopInfoDto.setRating(shop.getRating());
        shopInfoDto.setProductAmount(shop.getProductAmount());
        shopInfoDto.setPeopleTracking(shop.getPeopleTracking());

        return ResponseEntity.ok(shopInfoDto);
    }

    @GetMapping("/{id}/product")
    public ResponseEntity<List<ProductDto>> getShopProducts(@PathVariable int id,
                                                            @RequestParam(name = "pageNum", defaultValue = "1") int pageNum)
    {
        List<Product> products = productService.listAllByShopId(pageNum - 1, id).getContent();
        List<ProductDto> productDtos = products.stream().map(p -> {
            ProductDto dto = new ProductDto();
            dto.setId(p.getId());
            dto.setName(p.getName());
            dto.setAlias(p.getAlias());
            dto.setMainImage(p.getMainImage());
            dto.setPrice(p.getPrice());
            dto.setDiscountPercent(p.getDiscountPercent());
            dto.setReviewCount(p.getReviewCount());
            dto.setAverageRating(p.getAverageRating());
            return dto;
        }).toList();
        return ResponseEntity.ok(productDtos);
    }



}

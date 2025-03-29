package com.pbl5.client.controller;

import com.pbl5.client.dto.ProductDto;
import com.pbl5.client.service.ProductService;
import com.pbl5.common.entity.product.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired private ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDto>> listProduct(
            @RequestParam(name = "pageNum", defaultValue = "1") int pageNum) {

        List<ProductDto> productDtos = new ArrayList<>();

        productService.listAll(0).getContent().forEach(p -> {
            ProductDto dto = new ProductDto();
            dto.setId(p.getId());
            dto.setName(p.getName());
            dto.setAlias(p.getAlias());
            dto.setMainImage(p.getMainImage());
            dto.setPrice(p.getPrice());
            dto.setDiscountPercent(p.getDiscountPercent());
            dto.setReviewCount(p.getReviewCount());
            dto.setAverageRating(p.getAverageRating());
            productDtos.add(dto);
        });

        return ResponseEntity.ok(productDtos);
    }
}

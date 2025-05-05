package com.pbl5.admin.controller.shop;

import com.pbl5.admin.service.shop.BrandService;
import com.pbl5.client.dto.BrandDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    @GetMapping
    public ResponseEntity<List<BrandDto>> getAllBrands() {
        List<BrandDto> brands = brandService.getAllBrands();
        return ResponseEntity.ok(brands);
    }

    @GetMapping("/by-category/{categoryId}")
    public ResponseEntity<List<BrandDto>> getBrandsByCategory(@PathVariable Long categoryId) {
        List<BrandDto> brands = brandService.getBrandsByCategory(categoryId);
        return ResponseEntity.ok(brands);
    }
}

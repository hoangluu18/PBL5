package com.pbl5.admin.controller.shop;
import com.pbl5.admin.service.shop.CategoryService;
import com.pbl5.client.dto.category.CategoryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        List<CategoryDto> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/by-brand/{brandId}")
    public ResponseEntity<List<CategoryDto>> getCategoriesByBrand(@PathVariable Long brandId) {
        List<CategoryDto> categories = categoryService.getCategoriesByBrand(brandId);
        return ResponseEntity.ok(categories);
    }

}

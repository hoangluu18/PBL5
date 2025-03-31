package com.pbl5.client.controller;

import com.pbl5.client.dto.category.RootCategoryDto;
import com.pbl5.client.service.CategoryService;
import com.pbl5.common.entity.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    @Autowired private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<RootCategoryDto>> listRootCategories() {
        List<RootCategoryDto> rootCategoryDtos = new ArrayList<>();
        List<Category> rootCategories = categoryService.listAllRootCategories();

        rootCategories.forEach(c -> {
            RootCategoryDto dto = new RootCategoryDto(c.getId(), c.getName(), c.getAlias(), c.getImage());
            rootCategoryDtos.add(dto);
        });

        return ResponseEntity.ok(rootCategoryDtos);
    }


}

package com.pbl5.admin.service.shop;

import com.pbl5.client.dto.category.CategoryDto;

import java.util.List;

public interface CategoryService {
    List<CategoryDto> getAllCategories();
    List<CategoryDto> getCategoriesByBrand(Long brandId);

    List<com.pbl5.admin.dto.admin.CategoryDto> getAllAdminCategories();

    com.pbl5.admin.dto.admin.CategoryDto saveCategory(com.pbl5.admin.dto.admin.CategoryDto categoryDto);

    void deleteCategory(Integer id);
}

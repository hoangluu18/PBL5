package com.pbl5.client.service;

import com.pbl5.client.dto.BrandDto;
import com.pbl5.client.dto.category.CategoryDto;
import com.pbl5.client.exception.CategoryNotFoundException;
import com.pbl5.common.entity.Category;

import java.util.List;

public interface CategoryService {

    List<Category> listAllRootCategories();

    List<Category> getParents(Category category);

    List<CategoryDto> getChildren(Category category);

    Category getCategory(String alias) throws CategoryNotFoundException;

    List<BrandDto> getBrands(Category category);

    List<CategoryDto> getAll();
}

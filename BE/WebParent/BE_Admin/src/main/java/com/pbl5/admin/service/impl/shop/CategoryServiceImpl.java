package com.pbl5.admin.service.impl.shop;

import com.pbl5.admin.repository.shop.BrandRepository;
import com.pbl5.admin.repository.shop.CategoryRepository;
import com.pbl5.admin.service.shop.CategoryService;
import com.pbl5.client.dto.category.CategoryDto;

import com.pbl5.common.entity.Brand;
import com.pbl5.common.entity.Category;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, BrandRepository brandRepository) {
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
    }

    @Override
    public List<CategoryDto> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryDto> getCategoriesByBrand(Long brandId) {
        Brand brand = brandRepository.findById(Math.toIntExact(brandId))
                .orElseThrow(() -> new EntityNotFoundException("Brand not found"));

        return brand.getCategories().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private CategoryDto convertToDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        return dto;
    }
}

package com.pbl5.admin.service.impl.shop;

import com.pbl5.admin.repository.shop.BrandRepository;
import com.pbl5.admin.repository.shop.CategoryRepository;
import com.pbl5.admin.service.shop.CategoryService;
import com.pbl5.client.dto.category.CategoryDto;

import com.pbl5.common.entity.Brand;
import com.pbl5.common.entity.Category;
import jakarta.persistence.EntityNotFoundException;
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

    @Override
    public List<com.pbl5.admin.dto.admin.CategoryDto> getAllAdminCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(category -> new com.pbl5.admin.dto.admin.CategoryDto(
                        category.getId(),
                        category.getName(),
                        category.getAlias(),
                        category.isEnabled(),
                        category.getImage(),
                        category.getParent() != null ? category.getParent().getId() : null,
                        category.getAllParentIds()))
                .collect(Collectors.toList());
    }

    @Override
    public com.pbl5.admin.dto.admin.CategoryDto saveCategory(com.pbl5.admin.dto.admin.CategoryDto categoryDto) {

        Category category = new Category();
        category.setId(categoryDto.getId());
        category.setName(categoryDto.getName());
        category.setAlias(categoryDto.getAlias());
        category.setEnabled(categoryDto.isEnabled());
        category.setImage(categoryDto.getImage());
        if (categoryDto.getParent_id() != null) {
            Category parentCategory = categoryRepository.findById(categoryDto.getParent_id())
                    .orElseThrow(() -> new EntityNotFoundException("Parent category not found"));
            category.setParent(parentCategory);
        }
        category.setAllParentIds(categoryDto.getAll_parent_ids());
        Category savedCategory = categoryRepository.save(category);
        return new com.pbl5.admin.dto.admin.CategoryDto(
                savedCategory.getId(),
                savedCategory.getName(),
                savedCategory.getAlias(),
                savedCategory.isEnabled(),
                savedCategory.getImage(),
                savedCategory.getParent() != null ? savedCategory.getParent().getId() : null,
                savedCategory.getAllParentIds());
    }

    @Override
    public void deleteCategory(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        categoryRepository.delete(category);
    }

    private CategoryDto convertToDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        return dto;
    }


}

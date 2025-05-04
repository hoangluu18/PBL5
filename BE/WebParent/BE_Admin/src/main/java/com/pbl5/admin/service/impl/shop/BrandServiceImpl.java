package com.pbl5.admin.service.impl.shop;

import com.pbl5.admin.repository.shop.BrandRepository;
import com.pbl5.admin.repository.shop.CategoryRepository;
import com.pbl5.admin.service.shop.BrandService;
import com.pbl5.client.dto.BrandDto;

import com.pbl5.common.entity.Brand;
import com.pbl5.common.entity.Category;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public List<BrandDto> getAllBrands() {
        List<Brand> brands = brandRepository.findAll();
        return brands.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BrandDto> getBrandsByCategory(Long categoryId) {
        Category category = categoryRepository.findById(Math.toIntExact(categoryId))
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        return category.getBrands().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private BrandDto convertToDto(Brand brand) {
        BrandDto dto = new BrandDto();
        dto.setId(brand.getId());
        dto.setName(brand.getName());
        dto.setLogo(brand.getLogo());
        return dto;
    }
}
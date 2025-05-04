package com.pbl5.admin.service.shop;

import com.pbl5.client.dto.BrandDto;

import java.util.List;

public interface BrandService {
    List<BrandDto> getAllBrands();
    List<BrandDto> getBrandsByCategory(Long categoryId);
}

package com.pbl5.admin.service.shop;

import com.pbl5.client.dto.BrandDto;
import com.pbl5.common.entity.Brand;

import java.util.List;

public interface BrandService {
    List<BrandDto> getAllBrands();
    List<BrandDto> getBrandsByCategory(Long categoryId);
    void deleteBrandById(Integer id);

    Brand saveBrand(BrandDto brandDto);

    Brand updateBrand(BrandDto brandDto);
}

package com.pbl5.admin.service.shop;

import com.pbl5.client.dto.BrandDto;
import com.pbl5.common.entity.Brand;

import java.io.IOException;
import java.util.List;

public interface BrandService {
    List<BrandDto> getAllBrands();
    List<BrandDto> getBrandsByCategory(Long categoryId);
    void deleteBrandById(Integer id);

    Brand saveBrand(BrandDto brandDto) throws IOException;

    Brand updateBrand(BrandDto brandDto);
}

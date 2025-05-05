package com.pbl5.admin.service.impl.shop;

import com.pbl5.admin.repository.shop.ProductVariantRepository;
import com.pbl5.admin.service.shop.ProductVariantService;
import com.pbl5.common.entity.product.ProductVariant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductVariantServiceImpl implements ProductVariantService {
    private final ProductVariantRepository productVariantRepository;
    @Override
    public ProductVariant getProductVariantById(Long id) {
        return productVariantRepository.findById(id).orElseThrow(() -> new RuntimeException("Product variant not found"));
    }
}

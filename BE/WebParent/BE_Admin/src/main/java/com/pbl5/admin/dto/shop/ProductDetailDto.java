package com.pbl5.admin.dto.shop;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailDto {
    private Long id;
    private String name;
    private String alias;
    private float price;
    private float cost;
    private int quantity; // Tổng số lượng từ tất cả variants
    private String mainImage;
    private Date lastUpdated;
    private String fullDescription;
    private boolean enabled;

    private Long brandId;
    private String brandName;
    private Long categoryId;
    private String categoryName;

    // Thông tin chi tiết sản phẩm
    private List<ProductSpecificationDto> specifications;

    // Thông tin biến thể sản phẩm
    private List<ProductVariantGroupDto> variantGroups;
}


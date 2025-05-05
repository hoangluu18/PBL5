package com.pbl5.admin.dto.shop;

import lombok.Data;

import java.util.List;

@Data
public class ProductVariantGroupDto {
    private String name; // Tên nhóm biến thể (ví dụ: "Màu sắc", "Kích thước")
    private List<ProductVariantDto> variants;
}

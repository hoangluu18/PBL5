package com.pbl5.admin.dto.shop;

import lombok.Data;

@Data
public class ProductVariantDto {
    private Long id;
    private String key;
    private String value;
    private int quantity;
    private String photo;
    private Long parentId;
}

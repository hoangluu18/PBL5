package com.pbl5.admin.dto.shop;

import lombok.Data;

import java.util.Date;

@Data
public class ProductDto {
    private Long id;
    private String code;
    private String name;
    private String alias;
    private float price;
    private float cost;
    private int quantity; // Tổng số lượng từ tất cả variants
    private float discountPercent;
    private String mainImage;
    private Date lastUpdated;

    private float weight;
    private float height;
    private float width;
    private float length;
}
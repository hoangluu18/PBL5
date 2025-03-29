package com.pbl5.client.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDto {

    private Integer id;
    private String name;
    private String alias;
    private String mainImage;
    private float price;
    private float discountPercent;
    private int reviewCount;
    private float averageRating;
}

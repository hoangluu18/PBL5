package com.pbl5.client.dto.product;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDetailDto {

    private String name;
    private String value;

    public ProductDetailDto() {
    }

    public ProductDetailDto(String name, String value) {
        this.name = name;
        this.value = value;
    }
}

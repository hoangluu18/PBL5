package com.pbl5.client.dto.product;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductVariantDto {
    private Integer id;
    private String key;
    private String value;
    private Integer quantity;
    private String photo;
    private Integer parentId;

    @Override
    public String toString() {
        return "ProductVariantDto{" +
                "value='" + value + '\'' +
                ", quantity=" + quantity +
                ", photo='" + photo + '\'' +
                '}';
    }
}

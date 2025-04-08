package com.pbl5.client.dto.product;

import com.pbl5.common.entity.product.Product;
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

    public void clone(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.alias = product.getAlias();
        this.mainImage = product.getMainImage();
        this.price = product.getPrice();
        this.discountPercent = product.getDiscountPercent();
        this.reviewCount = product.getReviewCount();
        this.averageRating = product.getAverageRating();
    }
}

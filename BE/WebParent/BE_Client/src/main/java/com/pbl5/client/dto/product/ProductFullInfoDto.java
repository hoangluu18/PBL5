package com.pbl5.client.dto.product;

import com.pbl5.client.dto.ShopDto;
import com.pbl5.client.dto.category.CategoryDto;
import com.pbl5.common.entity.product.Product;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Setter
@Getter
public class ProductFullInfoDto  extends ProductDto{

    private String fullDescription;
    private boolean inStock;


    private List<CategoryDto> breadCrumbs = new ArrayList<>();

    private List<String> images = new ArrayList<>();

    private Map<String, List<ProductVariantDto>> variantMap = new HashMap<>();

    private ShopDto shopDto;

    public void addImage(String image){
        images.add(image);
    }

    public void cloneProduct(Product product) {
        this.setId(product.getId());
        this.setName(product.getName());
        this.setAlias(product.getAlias());
        this.setMainImage(product.getMainImage());
        this.setPrice(product.getPrice());
        this.setDiscountPercent(product.getDiscountPercent());
        this.setReviewCount(product.getReviewCount());
        this.setAverageRating(product.getAverageRating());
        this.setFullDescription(product.getFullDescription());
        this.setInStock(product.isInStock());

    }
}

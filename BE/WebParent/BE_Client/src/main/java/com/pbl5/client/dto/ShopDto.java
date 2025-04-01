package com.pbl5.client.dto;

import com.pbl5.common.entity.Shop;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class ShopDto {

    private Integer id;
    private String name;
    private Date createdAt;
    private String photo;
    private Float rating;
    private Integer productAmount;
    private Integer peopleTracking;

    public ShopDto() {
    }

    public void cloneShop(Shop shop) {
        this.setId(shop.getId());
        this.setName(shop.getName());
        this.setCreatedAt(shop.getCreatedAt());
        this.setPhoto(shop.getPhoto());
        this.setRating(shop.getRating());
        this.setProductAmount(shop.getProductAmount());
        this.setPeopleTracking(shop.getPeopleTracking());
    }
}

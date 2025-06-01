package com.pbl5.admin.dto.admin;

import com.pbl5.common.entity.Shop;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShopDto {
    private String id;
    private String name;
    private String description;
    private boolean enabled;
    private String address;
    private String photo;
    private Float rating;
    private Integer productAmount;
    private Integer peopleTracking;
    private String phone;
    private String city;

    public ShopDto clone(Shop shop){
        this.setId(String.valueOf(shop.getId()));
        this.setName(shop.getName());
        this.setDescription(shop.getDescription());
        this.setEnabled(shop.isEnabled());
        this.setAddress(shop.getAddress());
        this.setPhoto(shop.getPhoto());
        this.setRating(shop.getRating());
        this.setProductAmount(shop.getProductAmount());
        this.setPeopleTracking(shop.getPeopleTracking());
        this.setPhone(shop.getPhone());
        this.setCity(shop.getCity());
        return this;
    }
}

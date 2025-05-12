package com.pbl5.admin.dto.shop;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShopProfileDto {
    private int id;
    private String name;
    private String description;
    private String address;
    private String phone;
    private String photo;
    private Integer peopleTracking;
    private String city;
    private Integer productAmount;
    private Float rating;
    private Date createdAt;
    private Date updatedAt;
    private boolean enabled;
    private int userId;
}
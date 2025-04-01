package com.pbl5.client.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ShopTrackingDto {
    private Integer shopId;
    private String shopName;
    private String photo;
    private String rating;
    private String peopleTracking;
 }

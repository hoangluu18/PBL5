package com.pbl5.client.dto.shop_detail;

import com.pbl5.client.dto.ShopDto;
import lombok.Data;

@Data
public class ShopInfoDto extends ShopDto {
    private String phone;
    private String email;
    private String address;
    private String description;
}

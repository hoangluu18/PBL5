package com.pbl5.client.dto.checkout;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AddressInfoDto {
    private String name;
    private String address;
    private String phone;
}

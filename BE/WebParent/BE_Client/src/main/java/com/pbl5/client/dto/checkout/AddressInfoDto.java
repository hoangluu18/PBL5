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

    public String getCity() {
        if (address == null || !address.contains(",")) return "";
        String[] parts = address.split(",");
        return parts[parts.length - 1].trim();
    }
}

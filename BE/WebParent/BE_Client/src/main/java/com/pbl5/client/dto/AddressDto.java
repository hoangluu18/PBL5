package com.pbl5.client.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressDto {
    private Integer id;
    private Integer customerId;
    private String fullName;
    private String phoneNumber;
    private String address;
    private String city;
    private boolean enable;
    private boolean isDefault;
}

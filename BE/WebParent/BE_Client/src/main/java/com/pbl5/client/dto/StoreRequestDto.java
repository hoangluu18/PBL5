package com.pbl5.client.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoreRequestDto {
    private String storeName;
    private String address;
    private String phoneNumber;
    private String description;
    private Integer customerId;

    public StoreRequestDto(Integer id, String storeName, String address, String description, String phoneNumber, Integer id1, int status, Date requestDate) {
    }
}

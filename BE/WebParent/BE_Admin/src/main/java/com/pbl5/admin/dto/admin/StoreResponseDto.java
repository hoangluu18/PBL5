package com.pbl5.admin.dto.admin;

import com.pbl5.common.entity.StoreRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoreResponseDto {
    private Integer id;
    private String storeName;
    private String address;
    private String phoneNumber;
    private String description;
    private String responseNote;
    private int status;
    private String responseDate;
    private  String requestDate;

    private Integer customerId;
    private String customerName;
    private String customerEmail;

    public void clone(StoreRequest storeRequest){
        this.setAddress(storeRequest.getAddress());
        this.setStoreName(storeRequest.getStoreName());
        this.setPhoneNumber(storeRequest.getPhoneNumber());
        this.setDescription(storeRequest.getDescription());
        this.setCustomerId(storeRequest.getCustomer().getId());
    }
}

package com.pbl5.client.service;

import com.pbl5.client.dto.AddressDto;

import java.util.List;

public interface AddressService {
    List<AddressDto> getAddressesByCustomerId(Integer customerId);
    AddressDto addAddress(AddressDto dto);
    AddressDto updateAddress(Integer id, AddressDto dto);
    void disableAddress(Integer id);
    void setDefaultAddress(Integer addressId, Integer customerId);
}

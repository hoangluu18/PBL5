package com.pbl5.admin.service;

import com.pbl5.admin.dto.AddressDto;

import java.util.List;

public interface AddressService {
    List<AddressDto> getAddressesByCustomerId(Integer customerId);
}
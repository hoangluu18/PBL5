package com.pbl5.client.service.impl;

import com.pbl5.client.dto.checkout.AddressInfoDto;
import com.pbl5.client.repository.AddressInfoRepository;
import com.pbl5.client.service.AddressInfoService;
import com.pbl5.common.entity.Address;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AddressInfoServiceImpl implements AddressInfoService {
    @Autowired
    private AddressInfoRepository addressInfoRepository;
    @Override
    public AddressInfoDto fineByAddressDefault(int id) {
        AddressInfoDto checkoutInfoDto = new AddressInfoDto();
        Address address = addressInfoRepository.fineByAddressDefault(id);
        if (address != null) {
            checkoutInfoDto.setName(address.getFullName());
            checkoutInfoDto.setAddress(address.getAddress());
            checkoutInfoDto.setPhone(address.getPhoneNumber());
        }

        return checkoutInfoDto;
    }

    @Override
    public String findCityById(int id) {
        AddressInfoDto checkoutInfoDto = new AddressInfoDto();
        Address address = addressInfoRepository.fineByAddressDefault(id);
        return address != null ? address.getCity() : "";
    }
}

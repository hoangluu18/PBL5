package com.pbl5.client.service;

import com.pbl5.client.dto.checkout.AddressInfoDto;
import com.pbl5.client.dto.checkout.CheckoutInfoDto;

public interface AddressInfoService {
    AddressInfoDto fineByAddressDefault(int id);
    String findCityById(int id);
}

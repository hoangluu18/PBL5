package com.pbl5.admin.service.impl;

import com.pbl5.admin.dto.AddressDto;
import com.pbl5.admin.repository.AddressRepository;
import com.pbl5.admin.service.AddressService;
import com.pbl5.common.entity.Address;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;

    @Autowired
    public AddressServiceImpl(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    @Override
    public List<AddressDto> getAddressesByCustomerId(Integer customerId) {
        List<Address> addresses = addressRepository.findByCustomerIdAndEnable(customerId, true);

        return addresses.stream()
                .map(address -> new AddressDto(
                        address.getId(),
                        address.getFullName(),
                        address.getPhoneNumber(),
                        address.getAddress(),
                        address.getCity(),
                        address.isDefault()
                ))
                .collect(Collectors.toList());
    }
}

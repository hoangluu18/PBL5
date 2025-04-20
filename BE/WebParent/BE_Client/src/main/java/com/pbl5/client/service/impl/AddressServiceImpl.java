package com.pbl5.client.service.impl;

import com.pbl5.client.dto.AddressDto;
import com.pbl5.client.repository.AddressRepository;
import com.pbl5.client.service.AddressService;
import com.pbl5.common.entity.Address;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;

    @Override
    public List<AddressDto> getAddressesByCustomerId(Integer customerId) {
        return addressRepository.findEnabledByCustomerId(customerId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AddressDto addAddress(AddressDto dto) {
        Address address = convertToEntity(dto);
        address.setEnable(true); // mặc định enable khi thêm
        Address saved = addressRepository.save(address);
        return convertToDto(saved);
    }

    @Override
    public AddressDto updateAddress(Integer id, AddressDto dto) {
        Address address = addressRepository.findById(Long.valueOf(id)).orElseThrow();
        address.setFullName(dto.getFullName());
        address.setPhoneNumber(dto.getPhoneNumber());
        address.setAddress(dto.getAddress());
        address.setCity(dto.getCity());
        address.setDefault(dto.isDefault());
        Address updated = addressRepository.save(address);
        return convertToDto(updated);
    }

    @Override
    public void disableAddress(Integer id) {
        Address address = addressRepository.findById(Long.valueOf(id)).orElseThrow();
        address.setEnable(false);
        address.setDefault(false);
        addressRepository.save(address);
    }

    private AddressDto convertToDto(Address a) {
        return new AddressDto(
                a.getId(),
                a.getCustomerId(),
                a.getFullName(),
                a.getPhoneNumber(),
                a.getAddress(),
                a.getCity(),
                a.isEnable(),
                a.isDefault()
        );
    }

    private Address convertToEntity(AddressDto dto) {
        Address a = new Address();
        a.setId(dto.getId());
        a.setCustomerId(dto.getCustomerId());
        a.setFullName(dto.getFullName());
        a.setPhoneNumber(dto.getPhoneNumber());
        a.setAddress(dto.getAddress());
        a.setCity(dto.getCity());
        a.setEnable(dto.isEnable());
        a.setDefault(dto.isDefault());
        return a;
    }

    @Override
    public void setDefaultAddress(Integer addressId, Integer customerId) {
        //  is_default = false cho tất cả các địa chỉ của customer
        List<Address> addresses = addressRepository.findEnabledByCustomerId(customerId);
        for (Address addr : addresses) {
            addr.setDefault(false);
        }

        // set is_default = true cho địa chỉ được chọn
        Address defaultAddress = addressRepository.findById(Long.valueOf(addressId))
                .orElseThrow(() -> new RuntimeException("Address not found"));
        defaultAddress.setDefault(true);

        // lưu tất cả lại
        addressRepository.saveAll(addresses); // lưu địa chỉ đã set false
        addressRepository.save(defaultAddress); // lưu địa chỉ mặc định mới
    }
}

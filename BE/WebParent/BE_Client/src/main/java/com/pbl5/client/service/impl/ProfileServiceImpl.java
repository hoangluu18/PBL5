package com.pbl5.client.service.impl;

import com.pbl5.client.dto.ProfileDto;
import com.pbl5.client.service.ProfileService;
import com.pbl5.common.entity.Address;
import com.pbl5.common.entity.Customer;
import com.pbl5.client.repository.AddressRepository;
import com.pbl5.client.repository.ProfileRepository; // Đổi từ CustomerRepository
import com.pbl5.client.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProfileServiceImpl implements ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public ProfileDto getProfileByCustomerId(Long id) {
        // Lấy thông tin khách hàng
        Optional<Customer> profileOpt = profileRepository.findById(id);
        if (!profileOpt.isPresent()) {
            return null;
        }
        Customer profile = profileOpt.get();

        // Lấy danh sách địa chỉ
        List<Address> addresses = addressRepository.findEnabledByCustomerId(id.intValue());
        List<String> addressList = addresses.stream()
                .map(addr -> addr.getAddress() + ", " + addr.getCity())
                .collect(Collectors.toList());

        // Lấy địa chỉ mặc định
        Optional<Address> defaultAddressOpt = addressRepository.findDefaultAddressByCustomerId(id.intValue());
        String defaultAddress = defaultAddressOpt.isPresent()
                ? defaultAddressOpt.get().getAddress() + ", " + defaultAddressOpt.get().getCity()
                : null;

        // Tính toán các giá trị từ đơn hàng
        Double totalSpent = orderRepository.getTotalSpentByCustomerId(id.intValue());
        Integer totalOrder = orderRepository.getTotalOrderByCustomerId(id.intValue());
        Date lastOrder = orderRepository.getLastOrderByCustomerId(id.intValue());

        // Tạo ProfileDto
        return new ProfileDto(
                profile.getId().intValue(), // Chuyển từ Long sang Integer
                id.intValue(),
                profile.getFullName(),
                profile.getAvatar(),
                profile.getCreatedAt(),
                totalSpent != null ? totalSpent : 0.0,
                lastOrder,
                totalOrder != null ? totalOrder : 0,
                addressList,
                defaultAddress, // Thêm defaultAddress
                profile.getEmail(),
                profile.getPhoneNumber()
        );
    }
}
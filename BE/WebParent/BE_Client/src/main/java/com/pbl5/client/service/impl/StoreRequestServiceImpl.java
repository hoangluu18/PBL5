package com.pbl5.client.service.impl;

import com.pbl5.client.dto.StoreRequestDto;
import com.pbl5.client.repository.StoreRequestRepository;
import com.pbl5.client.service.StoreRequestService;
import com.pbl5.common.entity.Customer;
import com.pbl5.common.entity.StoreRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class StoreRequestServiceImpl implements StoreRequestService {

    @Autowired
    private StoreRequestRepository storeRequestRepository;

    @Override
    public void save(StoreRequestDto request) {
        StoreRequest storeRequest = new StoreRequest();
        storeRequest.setStoreName(request.getStoreName());
        storeRequest.setAddress(request.getAddress());
        storeRequest.setDescription(request.getDescription());
        storeRequest.setPhoneNumber(request.getPhoneNumber());
        storeRequest.setCustomer(new Customer(request.getCustomerId()));
        storeRequest.setStatus(0);
        storeRequest.setRequestDate(new Date());
        storeRequestRepository.save(storeRequest);
    }

    @Override
    public List<StoreRequestDto> getAllStoreRequests() {
        return storeRequestRepository.findAll().stream()
                .map(storeRequest -> new StoreRequestDto(
                        storeRequest.getId(),
                        storeRequest.getStoreName(),
                        storeRequest.getAddress(),
                        storeRequest.getDescription(),
                        storeRequest.getPhoneNumber(),
                        storeRequest.getCustomer().getId(),
                        storeRequest.getStatus(),
                        storeRequest.getRequestDate()))
                .toList();
    }

    @Override
    public StoreRequest getStoreRequestByCustomerId(Integer customerId) {
        return storeRequestRepository.findByCustomerId(customerId);
    }
}

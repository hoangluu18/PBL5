package com.pbl5.client.service;

import com.pbl5.client.dto.StoreRequestDto;
import com.pbl5.common.entity.StoreRequest;

import java.util.List;

public interface StoreRequestService {

    public void save(StoreRequestDto request);

    List<StoreRequestDto> getAllStoreRequests();


    StoreRequest getStoreRequestByCustomerId(Integer customerId);
}

package com.pbl5.admin.service.admin;

import com.pbl5.admin.dto.admin.StoreResponseDto;

import java.util.List;

public interface StoreRequestService {

    List<StoreResponseDto> getAllStoreRequests();

    String respondToStoreRequest(Integer id, String response, String responseNote);
}

package com.pbl5.client.controller;

import com.pbl5.client.dto.StoreRequestDto;
import com.pbl5.client.service.StoreRequestService;
import com.pbl5.common.entity.StoreRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/store-requests")
public class StoreRequestController {

    @Autowired
    private StoreRequestService storeRequestService;

    @PostMapping("/save")
    public void saveStoreRequest(@RequestBody StoreRequestDto request) {
        storeRequestService.save(request);
    }

    @GetMapping
    public List<StoreRequestDto> getAllStoreRequests() {
        return storeRequestService.getAllStoreRequests();
    }

    @GetMapping("/customer/{customerId}")
    public StoreRequest getStoreRequestByCustomerId(@PathVariable Integer customerId) {
        return storeRequestService.getStoreRequestByCustomerId(customerId);
    }

}

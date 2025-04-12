package com.pbl5.client.controller;

import com.pbl5.client.dto.AddressDto;
import com.pbl5.client.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    // GET: /api/addresses/customer/5
    @GetMapping("/customer/{customerId}")
    public List<AddressDto> getAddressesByCustomer(@PathVariable Integer customerId) {
        return addressService.getAddressesByCustomerId(customerId);
    }

    // POST: /api/addresses
    @PostMapping
    public AddressDto addAddress(@RequestBody AddressDto dto) {
        return addressService.addAddress(dto);
    }

    // PUT: /api/addresses/{id}
    @PutMapping("/{id}")
    public AddressDto updateAddress(@PathVariable Integer id, @RequestBody AddressDto dto) {
        return addressService.updateAddress(id, dto);
    }

    // PATCH: /api/addresses/{id}/disable
    @PatchMapping("/{id}/disable")
    public void disableAddress(@PathVariable Integer id) {
        addressService.disableAddress(id);
    }

    @PatchMapping("/{id}/set-default")
    public void setDefaultAddress(@PathVariable Integer id, @RequestParam Integer customerId) {
        addressService.setDefaultAddress(id, customerId);
    }
}

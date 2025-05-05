package com.pbl5.admin.controller;

import com.pbl5.admin.dto.AddressDto;
import com.pbl5.admin.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    @Autowired
    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping("/customer/{customerId}")
    public List<AddressDto> getAddressesByCustomerId(@PathVariable Integer customerId) {
        return addressService.getAddressesByCustomerId(customerId);
    }
}
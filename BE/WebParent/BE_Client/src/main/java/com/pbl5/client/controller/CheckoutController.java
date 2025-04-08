package com.pbl5.client.controller;

import com.pbl5.client.common.Constants;
import com.pbl5.client.dto.CartProductDto;
import com.pbl5.client.dto.CustomerDto;
import com.pbl5.client.dto.checkout.AddressInfoDto;
import com.pbl5.client.dto.checkout.CheckoutInfoDto;
import com.pbl5.client.dto.checkout.ShippingRequestDto;
import com.pbl5.client.dto.checkout.ShippingRespondDto;
import com.pbl5.client.exception.ProductNotFoundException;
import com.pbl5.client.repository.OrderRepository;
import com.pbl5.client.service.*;
import com.pbl5.common.entity.*;
import com.pbl5.common.entity.product.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = Constants.FE_URL)
public class CheckoutController {

    @Autowired
    private CheckoutService checkoutService;

    @GetMapping
    public ResponseEntity<CheckoutInfoDto> getCheckoutInfo() throws ProductNotFoundException {
        int customerId = 1;

        return checkoutService.getCheckoutInfo(customerId) != null ?
                ResponseEntity.ok(checkoutService.getCheckoutInfo(customerId)) :
                ResponseEntity.notFound().build();

    }


    @PostMapping("/save")
    public ResponseEntity<CheckoutInfoDto> saveCheckoutInfo(@RequestParam Integer customerId) throws ProductNotFoundException {
        return checkoutService.saveCheckoutInfo(customerId) != null ?
                ResponseEntity.ok(checkoutService.saveCheckoutInfo(customerId)) :
                ResponseEntity.notFound().build();
    }
}
package com.pbl5.client.controller;

import com.pbl5.client.common.Constants;
import com.pbl5.client.dto.CartProductDto;
import com.pbl5.client.dto.CustomerDto;
import com.pbl5.client.dto.checkout.*;
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

    @PostMapping("/{customerId}")
    public ResponseEntity<CheckoutInfoDto> getCheckoutInfoForSelectedProducts(
            @PathVariable Integer customerId,
            @RequestBody List<Integer> cartIds
    ) throws ProductNotFoundException {
        System.out.println("cartIds: " + cartIds);
        if (cartIds == null || cartIds.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        //

        // Get checkout info with only the selected products
        CheckoutInfoDto checkoutInfo = checkoutService.getCheckoutInfoForSelectedProducts(customerId, cartIds);

        return checkoutInfo != null ?
                ResponseEntity.ok(checkoutInfo) :
                ResponseEntity.notFound().build();
    }


    @PostMapping("/save/{customerId}")
    public ResponseEntity<String> saveCheckoutInfo(
            @PathVariable Integer customerId,
            @RequestBody List<Integer> cartIds
    ) throws ProductNotFoundException {
        return checkoutService.saveCheckoutInfo(customerId,cartIds) != null ?
                ResponseEntity.ok("Checkout info saved successfully") :
                ResponseEntity.notFound().build();
    }


    //buy now
    @PostMapping("/buy-now/{customerId}")
    public ResponseEntity<CheckoutInfoDto> getCheckoutInfoForBuyNow(
            @PathVariable Integer customerId,
            @RequestBody BuyNowRequestDto buyNowRequest
    ) throws ProductNotFoundException {
        // Chuyển đổi BuyNowRequest thành một checkout info đơn giản
        CheckoutInfoDto checkoutInfo = checkoutService.getCheckoutInfoForBuyNow(
                customerId,
                buyNowRequest.getProductId(),
                buyNowRequest.getQuantity(),
                buyNowRequest.getProductDetail()
        );

        return checkoutInfo != null ?
                ResponseEntity.ok(checkoutInfo) :
                ResponseEntity.notFound().build();
    }

    @PostMapping("/save-buy-now/{customerId}")
    public ResponseEntity<String> saveCheckoutInfoBuyNow(
            @PathVariable Integer customerId,
            @RequestBody CheckoutInfoDto checkoutInfoDto
    ) {
        return checkoutService.saveCheckoutInfoBuyNow(customerId, checkoutInfoDto) ?
                ResponseEntity.ok("Buy now order saved successfully") :
                ResponseEntity.notFound().build();
    }

}
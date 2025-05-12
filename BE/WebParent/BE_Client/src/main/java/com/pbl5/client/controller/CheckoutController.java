package com.pbl5.client.controller;

import com.pbl5.client.common.Constants;
import com.pbl5.client.dto.checkout.*;
import com.pbl5.client.exception.ProductNotFoundException;
import com.pbl5.client.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = Constants.FE_URL)
public class CheckoutController {


    private final CheckoutService checkoutService;
    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

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
    public ResponseEntity<?> saveCheckoutInfo(
            @PathVariable Integer customerId,
            @RequestBody SaveCheckoutRequest request // Thay đổi tham số để nhận request object
    ) {
        try {
            // Trích xuất cartIds và paymentMethod từ request
            List<Integer> cartIds = request.getCartIds();
            String paymentMethod = request.getPaymentMethod();

            // Gọi service với paymentMethod
            CheckoutInfoDto result = checkoutService.saveCheckoutInfo(customerId, cartIds, paymentMethod);

            if (result != null) {
                Map<String, Object> response = new HashMap<>();

                // Lấy orderId từ Order, không phải cartProductDto
                Integer orderId = result.getOrderId(); // Giả sử bạn đã thêm trường này vào CheckoutInfoDto

                response.put("orderId", orderId);
                response.put("message", "Checkout info saved successfully");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
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
    public ResponseEntity<?> saveCheckoutInfoBuyNow(
            @PathVariable Integer customerId,
            @RequestBody SaveBuyNowRequest request // Thay đổi để nhận request với paymentMethod
    ) {
        CheckoutInfoDto checkoutInfoDto = request.getCheckoutInfo();
        String paymentMethod = request.getPaymentMethod();

        Map<String, Object> orderData = checkoutService.saveCheckoutInfoBuyNow(customerId, checkoutInfoDto, paymentMethod);

        if (orderData != null && orderData.containsKey("orderId")) {
            return ResponseEntity.ok(orderData); // Trả về cả orderId và message
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
package com.pbl5.client.controller;

import com.pbl5.client.common.Constants;
import com.pbl5.client.exception.OrderNotFoundException;
import com.pbl5.client.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(Constants.FE_URL)
public class OrderController {

    @Autowired private OrderService orderService;

    @GetMapping()
    public ResponseEntity<?> getOrders(@RequestParam Integer customerId) {
        try {
            return ResponseEntity.ok(orderService.getOrdersByCustomerId(customerId));
        } catch (OrderNotFoundException e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
}

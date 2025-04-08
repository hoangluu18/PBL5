package com.pbl5.client.controller;

import com.pbl5.client.dto.ProfileDto;
import com.pbl5.client.dto.OrderDto;
import com.pbl5.client.dto.ProfileReviewDto;
import com.pbl5.client.service.OrderService;
import com.pbl5.client.service.ProfileService;
import com.pbl5.client.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/{id}")
    public ResponseEntity<ProfileDto> getProfile(@PathVariable Long id) {
        ProfileDto profile = profileService.getProfileByCustomerId(id);
        if (profile != null) {
            return ResponseEntity.ok(profile);
        } else {
            return ResponseEntity.status(404).body(null);
        }
    }

    @GetMapping("/{id}/orders")
    public ResponseEntity<?> getOrdersByCustomerId(
            @PathVariable("id") Integer customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<OrderDto> orderPage = orderService.getOrdersByCustomerId(customerId, page, size);
            if (orderPage != null && !orderPage.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", orderPage.getContent());
                response.put("currentPage", page);
                response.put("pageSize", size);
                response.put("totalItems", orderPage.getTotalElements());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("data", null);
                response.put("currentPage", page);
                response.put("pageSize", size);
                response.put("totalItems", 0);
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("data", null);
            response.put("currentPage", page);
            response.put("pageSize", size);
            response.put("totalItems", 0);
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<?> getReviewsByCustomerId(@PathVariable("id") Integer customerId) {
        try {
            List<ProfileReviewDto> reviews = reviewService.getReviewsByCustomerId(customerId);
            if (reviews != null && !reviews.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", reviews);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("data", null);
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("data", null);
            return ResponseEntity.status(500).body(response);
        }
    }
}
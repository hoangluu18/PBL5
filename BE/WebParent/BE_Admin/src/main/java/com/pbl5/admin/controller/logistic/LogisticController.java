package com.pbl5.admin.controller.logistic;

import com.pbl5.admin.dto.ResponseDto;
import com.pbl5.admin.dto.UserDto;
import com.pbl5.admin.dto.orders.OrderDetailDto;
import com.pbl5.admin.service.OrderService;
import com.pbl5.admin.service.UserService;
import com.pbl5.common.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logistic")
@CrossOrigin(origins = "*")
public class LogisticController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders() {
        ResponseDto response = new ResponseDto();
        try {
            List<OrderDetailDto> orders = orderService.getAllOrderDetails();
            response.setStatusCode(200);
            response.setMessage("Get all orders successfully");
            response.setData(orders);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error retrieving orders: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping("/orders/{orderId}/{status}")
    public ResponseEntity<?> updateOrderStatus(@PathVariable int orderId, @PathVariable String status) {
        ResponseDto response = new ResponseDto();
        try {
            orderService.updateOrderStatus(orderId, status);
            response.setStatusCode(200);
            response.setMessage("Order status updated successfully");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error updating order status: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable int userId) {
        ResponseDto response = new ResponseDto();
        try {
            User user = userService.findById(userId);
            response.setStatusCode(200);
            response.setMessage("User profile retrieved successfully");
            response.setData(user);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error retrieving user profile: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

s    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestBody UserDto userDto) {
        ResponseDto response = new ResponseDto();
        try {
            User updatedUser = userService.save(userDto);
            response.setStatusCode(200);
            response.setMessage("User profile updated successfully");
            response.setData(updatedUser);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error updating user profile: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }
}

package com.pbl5.client.controller;

import com.pbl5.client.dto.CartProductDto;
import com.pbl5.client.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/cart")
public class CartController {

    @Autowired private CartService cartService;
    @GetMapping("/{customerId}")
    public List<CartProductDto> getCart(@PathVariable Integer customerId) {
        return cartService.getCartByCustomerId(customerId);
    }

    @DeleteMapping("/delete/{customerId}/{productId}")
    public ResponseEntity<String> deleteCartItem(@PathVariable Integer customerId, @PathVariable Integer productId) {
        boolean deleted = cartService.deleteCartItem(customerId, productId);
        if (deleted) {
            return ResponseEntity.ok("Sản phẩm đã được xóa khỏi giỏ hàng");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sản phẩm không tồn tại trong giỏ hàng");
        }
    }
}

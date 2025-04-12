package com.pbl5.client.controller;

import com.pbl5.client.dto.AddToCartDto;
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

    @DeleteMapping("/delete/{cartItemId}")
    public ResponseEntity<String> deleteCartItemById(@PathVariable Long cartItemId) {
        boolean deleted = cartService.deleteCartItemById(cartItemId);
        if (deleted) {
            return ResponseEntity.ok("Cart item deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cart item not found");
        }
    }

    @PostMapping("/add")
    public ResponseEntity<String> addIntoCart(@RequestBody AddToCartDto dto) {
        String res = cartService.addToCart(dto);
        return ResponseEntity.ok(res);
    }
}

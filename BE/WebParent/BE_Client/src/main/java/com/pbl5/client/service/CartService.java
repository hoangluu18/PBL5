package com.pbl5.client.service;

import com.pbl5.client.dto.CartProductDto;

import java.util.List;

public interface CartService {
    List<CartProductDto> getCartByCustomerId(Integer customerId);
    boolean deleteCartItem(Integer customerId, Integer productId);
    boolean deleteAllCartItemsByCustomerId(Integer customerId);
}
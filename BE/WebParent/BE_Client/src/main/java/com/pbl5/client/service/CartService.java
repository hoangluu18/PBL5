package com.pbl5.client.service;

import com.pbl5.client.dto.AddToCartDto;
import com.pbl5.client.dto.CartProductDto;

import java.util.List;

public interface CartService {
    List<CartProductDto> getCartByCustomerId(Integer customerId);
    boolean deleteCartItemById(Long cartItemId);


    String addToCart(AddToCartDto addToCartDto);

    boolean deleteAllCartItemsByCustomerId(Integer customerId);

    int countProductsByCustomerId(Integer customerId);
}
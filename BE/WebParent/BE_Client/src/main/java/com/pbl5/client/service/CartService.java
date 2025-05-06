package com.pbl5.client.service;

import com.pbl5.client.dto.AddToCartDto;
import com.pbl5.client.dto.CartProductDto;

import java.util.List;

public interface CartService {
    List<CartProductDto> getCartByCustomerId(Integer customerId);
    List<CartProductDto> getCartByCustomerIdAndProductIdList(Integer customerId, List<Integer> productIdList);
    boolean deleteCartItemById(Long cartItemId);


    String addToCart(AddToCartDto addToCartDto);

    boolean deleteAllCartItemsByCustomerId(Integer customerId);
    boolean deleteCartItemByCustomerIdAndCartId(Integer customerId, List<Integer> cartIds);

    int countProductsByCustomerId(Integer customerId);
    boolean updateCartItemQuantity(Long cartItemId, Integer newQuantity);
}
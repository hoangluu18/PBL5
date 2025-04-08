package com.pbl5.client.service.impl;

import com.pbl5.client.dto.AddToCartDto;
import com.pbl5.client.dto.CartProductDto;
import com.pbl5.client.repository.CartItemRepository;
import com.pbl5.client.service.CartService;
import com.pbl5.common.entity.CartItems;
import com.pbl5.common.entity.Customer;
import com.pbl5.common.entity.product.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Override
    public List<CartProductDto> getCartByCustomerId(Integer customerId) {
        List<CartItems> cartItems = cartItemRepository.findByCustomerId(customerId);

        return cartItems.stream().map(item -> {
            double originalPrice = item.getProduct().getPrice();
            double discountPercent = item.getProduct().getDiscountPercent();
            double lastPrice = originalPrice * (1 - discountPercent / 100);  // Tính giá sau giảm giá

            return new CartProductDto(
                    item.getProduct().getId(),
                    item.getProduct().getName(),
                    item.getQuantity(),
                    originalPrice,  // Thêm giá gốc
                    discountPercent,  // Thêm phần trăm giảm giá
                    lastPrice,  // Giá sau cùng
                    item.getProduct().getMainImage(),
                    item.getProduct().getShop().getName(),
                    item.getProduct().getShop().getId(),
                    item.getProductDetail()  // Dữ liệu biến thể đã lưu trực tiếp
            );
        }).collect(Collectors.toList());
    }

    @Override
    public boolean deleteCartItem(Integer customerId, Integer productId) {
        Optional<CartItems> cartItem = cartItemRepository.findByCustomerIdAndProductId(customerId, productId);
        if (cartItem.isPresent()) {
            cartItemRepository.delete(cartItem.get());
            return true;
        }
        return false;
    }

    @Override
    public String addToCart(AddToCartDto dto) {
        Optional<CartItems> cartItemsOptional = cartItemRepository.findByCustomerIdAndProductId(dto.getCustomerId(), dto.getProductId());
        if (cartItemsOptional.isEmpty() || !cartItemsOptional.get().getProductDetail().equals(dto.getProductDetail())) {
            CartItems cartItems = new CartItems();
            cartItems.setCustomer(new Customer(dto.getCustomerId()));
            cartItems.setProduct(new Product(dto.getProductId()));
            cartItems.setQuantity(dto.getQuantity());
            cartItems.setProductDetail(dto.getProductDetail());
            cartItemRepository.save(cartItems);
            return "Thêm vào giỏ hàng thành công";
        } else {
            CartItems cartItemsInDb = cartItemsOptional.get();
            cartItemsInDb.setQuantity(cartItemsInDb.getQuantity() + dto.getQuantity());
            cartItemRepository.save(cartItemsInDb);
            return "Cập nhật số lượng sản phẩm trong giỏ hàng thành công";
        }
    }
    
     @Override
    public boolean deleteAllCartItemsByCustomerId(Integer customerId) {
        if(cartItemRepository.findByCustomerId(customerId).isEmpty()) {
            return false;
        } else {
            cartItemRepository.deleteAll(cartItemRepository.findByCustomerId(customerId));
            return true;
        }
    }
}
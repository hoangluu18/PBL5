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
            double lastPrice = originalPrice * (1 - discountPercent / 100);

            CartProductDto dto = new CartProductDto(
                    item.getProduct().getId().longValue(),
                    item.getId(),
                    item.getProduct().getName(),
                    item.getProduct().getAlias(),
                    item.getQuantity(),
                    originalPrice,
                    discountPercent,
                    lastPrice,
                    item.getProduct().getMainImage(),
                    item.getProduct().getShop().getName(),
                    item.getProduct().getShop().getId(),
                    item.getProductDetail(),
                    true
                        );
            dto.setId(Long.valueOf(item.getId()));
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<CartProductDto> getCartByCustomerIdAndProductIdList(Integer customerId, List<Integer> productIdList) {
        List<CartItems> cartItems = cartItemRepository.findByCustomerId(customerId);

        return cartItems.stream()
                .filter(item -> productIdList.contains(item.getId())) // Only include items with matching product IDs
                .map(item -> {
                    double originalPrice = item.getProduct().getPrice();
                    double discountPercent = item.getProduct().getDiscountPercent();
                    double lastPrice = originalPrice * (1 - discountPercent / 100);

                    CartProductDto dto = new CartProductDto(
                            item.getProduct().getId().longValue(),
                            item.getProduct().getId(),
                            item.getProduct().getName(),
                            item.getProduct().getAlias(),
                            item.getQuantity(),
                            originalPrice,
                            discountPercent,
                            lastPrice,
                            item.getProduct().getMainImage(),
                            item.getProduct().getShop().getName(),
                            item.getProduct().getShop().getId(),
                            item.getProductDetail(),
                            true
                    );
                    dto.setId(Long.valueOf(item.getId()));
                    return dto;
                }).collect(Collectors.toList());
    }


    @Override
    public boolean deleteCartItemById(Long cartItemId) {
        Optional<CartItems> item = cartItemRepository.findById(cartItemId);
        if (item.isPresent()) {
            cartItemRepository.deleteById(cartItemId);
            return true;
        }
        return false;
    }

    @Override
    public String addToCart(AddToCartDto dto) {
        CartItems cartItem = cartItemRepository.findByCustomerIdAndProductIdWithDetail(dto.getCustomerId(), dto.getProductId(), dto.getProductDetail());
        if (cartItem == null) {
            CartItems cartItems = new CartItems();
            cartItems.setCustomer(new Customer(dto.getCustomerId()));
            cartItems.setProduct(new Product(dto.getProductId()));
            cartItems.setQuantity(dto.getQuantity());
            cartItems.setProductDetail(dto.getProductDetail());
            cartItemRepository.save(cartItems);
            return "Thêm vào giỏ hàng thành công";
        } else {

            cartItem.setQuantity(cartItem.getQuantity() + dto.getQuantity());
            cartItemRepository.save(cartItem);
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

    @Override
    public boolean deleteCartItemByCustomerIdAndCartId(Integer customerId, List<Integer> cartIds) {
        List<CartItems> cartItems = cartItemRepository.findByCustomerId(customerId);
        List<CartItems> itemsToDelete = cartItems.stream()
                .filter(item -> cartIds.contains(item.getId()))
                .collect(Collectors.toList());
        if (!itemsToDelete.isEmpty()) {
            cartItemRepository.deleteAll(itemsToDelete);
            return true;
        }
        return false;
    }

    @Override
    public int countProductsByCustomerId(Integer customerId) {

        return cartItemRepository.countProductsByCustomerId(customerId);
    }
}
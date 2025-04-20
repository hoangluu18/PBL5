package com.pbl5.client.service;

import com.pbl5.client.dto.CustomerDto;
import com.pbl5.client.dto.checkout.CheckoutInfoDto;
import com.pbl5.client.exception.ProductNotFoundException;
import com.pbl5.common.entity.Order;

import java.util.List;

public interface CheckoutService {
    CheckoutInfoDto getCheckoutInfo(int customerId,List<Integer> cartIds) throws ProductNotFoundException;
    List<Order> getOrderList(CheckoutInfoDto checkoutInfoDto, CustomerDto customerDto);
    int parseDeliveryDays(String deliveryTime);
    CheckoutInfoDto saveCheckoutInfo(int customerId,List<Integer> cartIds) throws ProductNotFoundException;
    CheckoutInfoDto getCheckoutInfoForSelectedProducts(int customerId, List<Integer> cartIds) throws ProductNotFoundException;

    CheckoutInfoDto getCheckoutInfoForBuyNow(Integer customerId, Integer productId, Integer quantity, String productDetail) throws ProductNotFoundException;
    boolean saveCheckoutInfoBuyNow(int customerId, CheckoutInfoDto checkoutInfoDto);
}

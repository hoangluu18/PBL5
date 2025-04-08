package com.pbl5.client.service;

import com.pbl5.client.dto.CartProductDto;
import com.pbl5.client.dto.order_detail.OrderDetailDto;
import com.pbl5.common.entity.CartItems;
import com.pbl5.common.entity.OrderDetail;

import java.util.List;

public interface OrderDetailService {
    List<OrderDetail> findAll();
    OrderDetail save(OrderDetail orderDetail);
    void deleteById(Integer id);
    boolean saveAll(List<OrderDetail> orderDetails);
    List<CartProductDto> getOrderDetailByOrderId(Integer orderId);
    List<CartProductDto> getOrderDetailByOrderIdAndCustomerId(Integer orderId, Integer customerId);
    OrderDetailDto getOrderDetailDto(Integer orderId);
    OrderDetailDto getOrderDetailDtoByCustomerId(Integer orderId, Integer customerId);
}
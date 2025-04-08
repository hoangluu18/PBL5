package com.pbl5.client.service;

import com.pbl5.client.dto.OrderInfoDto;
import com.pbl5.client.exception.OrderNotFoundException;
import com.pbl5.common.entity.Order;

import java.util.List;

public interface OrderService {
    boolean save(Order order);

    List<OrderInfoDto> getOrdersByCustomerId(Integer customerId) throws OrderNotFoundException;
}

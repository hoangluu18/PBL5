package com.pbl5.client.service;

import com.pbl5.client.dto.OrderDto;
import com.pbl5.common.entity.Order;
import org.springframework.data.domain.Page;

public interface OrderService {
    boolean save(Order order);
    Page<OrderDto> getOrdersByCustomerId(Integer customerId, int page, int size);
}
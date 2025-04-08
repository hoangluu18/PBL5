package com.pbl5.client.service;

import com.pbl5.client.dto.OrderInfoDto;
import com.pbl5.client.exception.OrderNotFoundException;

import com.pbl5.client.dto.OrderDto;

import com.pbl5.common.entity.Order;
import org.springframework.data.domain.Page;
import java.util.List;

import java.util.List;

public interface OrderService {
    boolean save(Order order);

    List<OrderInfoDto> getOrdersByCustomerId(Integer customerId) throws OrderNotFoundException;

    Page<OrderDto> getOrdersByCustomerId(Integer customerId, int page, int size);
    boolean saveAll(List<Order> order);
    Order findById(Integer id);

}

package com.pbl5.client.service;

import com.pbl5.common.entity.Order;

import java.util.List;

public interface OrderService {
    boolean save(Order order);
    boolean saveAll(List<Order> order);
    Order findById(Integer id);
}

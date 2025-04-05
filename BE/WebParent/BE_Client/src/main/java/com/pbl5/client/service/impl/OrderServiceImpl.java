package com.pbl5.client.service.impl;

import com.pbl5.client.repository.OrderRepository;
import com.pbl5.client.service.OrderService;
import com.pbl5.common.entity.Order;

public class OrderServiceImpl implements OrderService {
    private OrderRepository repository;
    @Override
    public boolean save(Order order) {
        if(order == null) {
            return false;
        }
        try {
            repository.save(order);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

    }
}
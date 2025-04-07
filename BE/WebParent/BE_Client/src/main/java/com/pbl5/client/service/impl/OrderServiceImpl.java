package com.pbl5.client.service.impl;

import com.pbl5.client.repository.OrderRepository;
import com.pbl5.client.service.OrderService;
import com.pbl5.common.entity.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
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

    @Override
    public boolean saveAll(List<Order> order) {
        if(order == null || order.isEmpty()) {
            return false;
        }
        try {
            repository.saveAll(order);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public Order findById(Integer id) {
        if(id == null) {
            return null;
        }
        try {
            return repository.findById(Math.toIntExact(id)).orElse(null);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


}

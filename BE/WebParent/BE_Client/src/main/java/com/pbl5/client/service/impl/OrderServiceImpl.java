package com.pbl5.client.service.impl;

import com.pbl5.client.dto.OrderDto;
import com.pbl5.client.repository.OrderRepository;
import com.pbl5.client.service.OrderService;
import com.pbl5.common.entity.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
    public Page<OrderDto> getOrdersByCustomerId(Integer customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size); // page bắt đầu từ 0
        Page<Order> orderPage = repository.findByCustomerId(customerId, pageable);
        return orderPage.map(OrderDto::new); // Map từ Order sang OrderDto
    }
}
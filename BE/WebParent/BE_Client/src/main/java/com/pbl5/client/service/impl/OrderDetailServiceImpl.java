package com.pbl5.client.service.impl;

import com.pbl5.client.repository.OrderDetailRepository;
import com.pbl5.client.service.OrderDetailService;
import com.pbl5.common.entity.OrderDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailServiceImpl implements OrderDetailService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Override
    public List<OrderDetail> findAll() {
        return orderDetailRepository.findAll();
    }

    @Override
    public OrderDetail save(OrderDetail orderDetail) {
        return orderDetailRepository.save(orderDetail);
    }

    @Override
    public void deleteById(Integer id) {
        orderDetailRepository.deleteById(id);
    }
}
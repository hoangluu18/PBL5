package com.pbl5.client.service;

import com.pbl5.common.entity.OrderDetail;

import java.util.List;

public interface OrderDetailService {
    List<OrderDetail> findAll();
    OrderDetail save(OrderDetail orderDetail);
    void deleteById(Integer id);
}
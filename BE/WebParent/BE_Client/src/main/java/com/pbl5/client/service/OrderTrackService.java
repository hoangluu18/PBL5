package com.pbl5.client.service;

import com.pbl5.common.entity.OrderTrack;

import java.util.List;

public interface OrderTrackService {
    List<OrderTrack> findAll();
    OrderTrack save(OrderTrack orderTrack);
    void deleteById(Integer id);
}
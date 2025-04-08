package com.pbl5.client.service.impl;

import com.pbl5.client.repository.OrderTrackRepository;
import com.pbl5.client.service.OrderTrackService;
import com.pbl5.common.entity.OrderTrack;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderTrackServiceImpl implements OrderTrackService {

    @Autowired
    private OrderTrackRepository orderTrackRepository;

    @Override
    public List<OrderTrack> findAll() {
        return orderTrackRepository.findAll();
    }

    @Override
    public OrderTrack save(OrderTrack orderTrack) {
        return orderTrackRepository.save(orderTrack);
    }

    @Override
    public void deleteById(Integer id) {
        orderTrackRepository.deleteById(id);
    }

    @Override
    public boolean saveAll(List<OrderTrack> orderTracks) {
        if(orderTracks == null || orderTracks.isEmpty()) {
            return false;
        }
        try {
            orderTrackRepository.saveAll(orderTracks);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
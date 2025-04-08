package com.pbl5.client.service.impl;

import com.pbl5.client.dto.OrderInfoDto;
import com.pbl5.client.exception.OrderNotFoundException;
import com.pbl5.client.repository.OrderRepository;
import com.pbl5.client.service.OrderService;
import com.pbl5.common.entity.Order;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
    public List<OrderInfoDto> getOrdersByCustomerId(Integer customerId) throws OrderNotFoundException {
        List<Order> orders = repository.findByCustomerId(customerId);
        if(orders == null) {
            throw new OrderNotFoundException("Không tìm thấy đơn hàng cho khách hàng: " + customerId);
        }
        List<OrderInfoDto> orderInfoDtos = new ArrayList<>();

        orders.forEach(order -> {
            OrderInfoDto dto = new OrderInfoDto();
            dto.setOrderId(order.getId());
            dto.setOrderDate(order.getOrderTime().toString());
            dto.setTotalAmount(order.getTotal());
            dto.setOrderStatus(order.getOrderTracks().get(0).getStatus().toString());

            orderInfoDtos.add(dto);
        });

        return  orderInfoDtos;
    }
}

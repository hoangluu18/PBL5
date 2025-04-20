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

import com.pbl5.client.dto.OrderDto;
import com.pbl5.client.repository.OrderRepository;
import com.pbl5.client.service.OrderService;
import com.pbl5.common.entity.Order;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderRepository repository;


    @Override
    public boolean save(Order order) {
        if (order == null) {
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
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orders = repository.findByCustomerId(customerId, pageable);
        return orders.map(OrderDto::new);
    }

    @Override
    public List<OrderInfoDto> getOrdersByCustomerId(Integer customerId) throws OrderNotFoundException {
        List<Order> orders = repository.findByCustomerId(customerId);
        orders.sort(Comparator.comparing(Order::getOrderTime).reversed());
        if(orders == null) {
            throw new OrderNotFoundException("Không tìm thấy đơn hàng cho khách hàng: " + customerId);
        }
        List<OrderInfoDto> orderInfoDtos = new ArrayList<>();

        orders.forEach(order -> {
            OrderInfoDto dto = new OrderInfoDto();
            dto.setOrderId(order.getId());
            dto.setOrderDate(order.getOrderTime().toString());
            dto.setTotalAmount(order.getTotal());
            dto.setOrderStatus(order.getOrderStatus().toString());

            orderInfoDtos.add(dto);
        });

        return  orderInfoDtos;
    }

    public boolean saveAll(List<Order> order) {
        if (order == null || order.isEmpty()) {
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
        if (id == null) {
            return null;
        }
        try {
            return repository.findById(id).orElse(null);

        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }


}

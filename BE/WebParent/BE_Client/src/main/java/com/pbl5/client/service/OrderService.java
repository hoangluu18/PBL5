package com.pbl5.client.service;


import com.pbl5.client.dto.OrderDto;
import com.pbl5.common.entity.Order;
import org.springframework.data.domain.Page;
import java.util.List;

public interface OrderService {
    boolean save(Order order);
    Page<OrderDto> getOrdersByCustomerId(Integer customerId, int page, int size);
    boolean saveAll(List<Order> order);
    Order findById(Integer id);
}

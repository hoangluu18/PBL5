package com.pbl5.client.service.impl;

import com.pbl5.client.dto.OrderInfoDto;
import com.pbl5.client.exception.OrderNotFoundException;
import com.pbl5.client.repository.OrderRepository;
import com.pbl5.client.repository.OrderTrackRepository;
import com.pbl5.client.repository.payment.EscrowRepository;
import com.pbl5.client.service.OrderService;
import com.pbl5.client.service.payment.EscrowService;
import com.pbl5.common.entity.Order;
import com.pbl5.common.entity.OrderTrack;
import com.pbl5.common.entity.Escrow;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;

import com.pbl5.client.dto.OrderDto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;


@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository repository;
    private final OrderTrackRepository orderTrackRepository;
    private final EscrowRepository escrowRepository;
    private final EscrowService escrowService;


    public OrderServiceImpl(OrderRepository repository, OrderTrackRepository orderTrackRepository, EscrowRepository escrowRepository, EscrowService escrowService) {
        this.repository = repository;
        this.orderTrackRepository = orderTrackRepository;
        this.escrowRepository = escrowRepository;
        this.escrowService = escrowService;
    }



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
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "orderTime"));
        Page<Order> orders = repository.findByCustomerId(customerId, pageable);
        return orders.map(OrderDto::new);
    }

    @Override
    public List<OrderInfoDto> getOrdersByCustomerId(Integer customerId) throws OrderNotFoundException {
        List<Order> orders = repository.findByCustomerId(customerId);

        orders.sort((o1, o2) -> o2.getOrderTime().compareTo(o1.getOrderTime()));

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

    @Transactional
    public void updateOrderStatus(Order order, Order.OrderStatus newStatus) {
        // Cập nhật trạng thái đơn hàng
        order.setOrderStatus(newStatus);
        repository.save(order);

        // Tạo order track
        OrderTrack orderTrack = new OrderTrack();
        orderTrack.setOrder(order);
        orderTrack.setStatus(OrderTrack.OrderStatus.valueOf(newStatus.name()));
        orderTrack.setUpdatedTime(new Date());
        orderTrack.setNotes("Trạng thái đơn hàng cập nhật thành: " + newStatus);
        orderTrackRepository.save(orderTrack);

        // Nếu đơn hàng đã giao thành công và phương thức thanh toán là ví điện tử
        // thì giải phóng tiền từ escrow sang ví shop
        if (newStatus == Order.OrderStatus.DELIVERED &&
                order.getPaymentMethod() == Order.PaymentMethod.WALLET) {

            try {
                // Tìm escrow cho đơn hàng
                Escrow escrowOpt = escrowRepository.findEscrowById(order.getId());
                if (escrowOpt != null) {
                    Escrow escrow = escrowOpt;
                    // Nếu escrow đang ở trạng thái giữ tiền thì giải phóng
                    if (escrow.getStatus() == Escrow.EscrowStatus.HOLDING) {
                        escrowService.releaseEscrow(escrow);

                        System.out.println("Đã giải phóng tiền từ escrow cho đơn hàng " + order.getId());
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("Lỗi khi giải phóng tiền từ escrow cho đơn hàng " + order.getId());
            }
        }
    }


}

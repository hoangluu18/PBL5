package com.pbl5.client.service.impl;

import com.pbl5.client.dto.CartProductDto;
import com.pbl5.client.dto.OrderDto;
import com.pbl5.client.dto.checkout.AddressInfoDto;
import com.pbl5.client.dto.order_detail.OrderDetailDto;
import com.pbl5.client.repository.OrderDetailRepository;
import com.pbl5.client.service.OrderDetailService;
import com.pbl5.client.service.OrderService;
import com.pbl5.common.entity.Order;
import com.pbl5.common.entity.OrderDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderDetailServiceImpl implements OrderDetailService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private OrderService orderService;

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

    @Override
    public boolean saveAll(List<OrderDetail> orderDetails) {
        if (orderDetails == null || orderDetails.isEmpty()) {
            return false;
        }
        try {
            orderDetailRepository.saveAll(orderDetails);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<CartProductDto> getOrderDetailByOrderId(Integer orderId) {
        List<OrderDetail> orderDetailList = orderDetailRepository.findAllByOrderId(orderId);

        return orderDetailList.stream().map(item -> {
            double originalPrice = item.getProduct().getPrice();
            double discountPercent = item.getProduct().getDiscountPercent();
            double lastPrice = originalPrice * (1 - discountPercent / 100);  // Tính giá sau giảm giá

            return new CartProductDto(
                    item.getProduct().getId(),
                    item.getProduct().getName(),
                    item.getQuantity(),
                    originalPrice,  // Thêm giá gốc
                    discountPercent,  // Thêm phần trăm giảm giá
                    lastPrice,  // Giá sau cùng
                    item.getProduct().getMainImage(),
                    item.getProduct().getShop().getName(),
                    item.getProduct().getShop().getId(),
                    item.getProductVariantDetail()  // Dữ liệu biến thể đã lưu trực tiếp
            );
        }).collect(Collectors.toList());
    }

    @Override
    public List<CartProductDto> getOrderDetailByOrderIdAndCustomerId(Integer orderId, Integer customerId) {
        List<OrderDetail> orderDetailList = orderDetailRepository.findAllByOrderIdAndCustomerId(orderId, customerId);
        if(orderDetailList == null || orderDetailList.isEmpty()) {
            return null;
        }
        else {
            return orderDetailList.stream().map(item -> {
                double originalPrice = item.getProduct().getPrice();
                double discountPercent = item.getProduct().getDiscountPercent();
                double lastPrice = originalPrice * (1 - discountPercent / 100);  // Tính giá sau giảm giá

                return new CartProductDto(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        originalPrice,  // Thêm giá gốc
                        discountPercent,  // Thêm phần trăm giảm giá
                        lastPrice,  // Giá sau cùng
                        item.getProduct().getMainImage(),
                        item.getProduct().getShop().getName(),
                        item.getProduct().getShop().getId(),
                        item.getProductVariantDetail()  // Dữ liệu biến thể đã lưu trực tiếp
                );
            }).collect(Collectors.toList());
        }
    }

    @Override
    public OrderDetailDto getOrderDetailDto(Integer orderId) {
//        private AddressInfoDto addressInfoDto;
//        private List<CartProductDto> cartProductDtoList;
//        private OrderDto orderDto;
        OrderDetailDto orderDetailDto = new OrderDetailDto();
        Order order = orderService.findById(orderId);
        List<CartProductDto> cartProductDtoList = getOrderDetailByOrderId(orderId);
        if(order != null && cartProductDtoList != null && !cartProductDtoList.isEmpty()) {
            orderDetailDto.setOrderDto(
                    new OrderDto(order)
            );
            orderDetailDto.setCartProductDtoList(cartProductDtoList);
            return orderDetailDto;
        }
        else{
            return null;
        }
    }

    @Override
    public OrderDetailDto getOrderDetailDtoByCustomerId(Integer orderId, Integer customerId) {
        //        private AddressInfoDto addressInfoDto;
//        private List<CartProductDto> cartProductDtoList;
//        private OrderDto orderDto;
        OrderDetailDto orderDetailDto = new OrderDetailDto();
        Order order = orderService.findById(orderId);
        List<CartProductDto> cartProductDtoList = getOrderDetailByOrderIdAndCustomerId(orderId,customerId);
        if(order != null && cartProductDtoList != null && !cartProductDtoList.isEmpty()) {
            orderDetailDto.setOrderDto(
                    new OrderDto(order)
            );
            orderDetailDto.setCartProductDtoList(cartProductDtoList);
            return orderDetailDto;
        }
        else{
            return null;
        }
    }
}


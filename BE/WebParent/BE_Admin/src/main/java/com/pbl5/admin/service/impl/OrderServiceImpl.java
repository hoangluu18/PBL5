package com.pbl5.admin.service.impl;

import com.pbl5.admin.dto.dashboard.RevenueReportDto;
import com.pbl5.admin.dto.dashboard.TodayStatisticDto;
import com.pbl5.admin.dto.dashboard.TopProductReportDto;
import com.pbl5.admin.dto.orders.*;
import com.pbl5.admin.repository.OrderDetailRepository;
import com.pbl5.admin.repository.OrderRepository;
import com.pbl5.admin.repository.OrderTrackRepository;
import com.pbl5.admin.repository.UserRepository;
import com.pbl5.admin.service.OrderService;
import com.pbl5.admin.service.payment.EscrowService;
import com.pbl5.admin.service.payment.WalletService;
import com.pbl5.admin.service.shop.ShopProfileService;
import com.pbl5.admin.specification.OrderSpecification;
import com.pbl5.common.entity.Order;
import com.pbl5.common.entity.OrderDetail;
import com.pbl5.common.entity.OrderTrack;
import com.pbl5.common.entity.product.Product;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    OrderDetailRepository orderDetailRepository;

    @Autowired
    private ShopProfileService shopProfileService;

    @Autowired
    private OrderTrackRepository orderTrackRepository;

    @Autowired
    private EscrowService escrowService;

    @Override
    public void updateOrder(OrderStatusDto orderStatusDto) {
        Optional<Order> orderOptional = orderRepository.findById(orderStatusDto.getOrderId());
        if (orderOptional.isEmpty()) {
            return;
        }

        Order orderInDb = orderOptional.get();

        // Convert String to Date
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date deliveryDate = dateFormat.parse(orderStatusDto.getDeliveryDate());
            orderInDb.setDeliverDate(deliveryDate);
        } catch (ParseException e) {
            throw new IllegalArgumentException("Invalid date format for delivery date", e);
        }

        orderInDb.setOrderStatus(Order.OrderStatus.valueOf(orderStatusDto.getOrderStatus()));

        orderInDb.setPaymentMethod(Order.PaymentMethod.valueOf(orderStatusDto.getPaymentMethod()));


        orderRepository.save(orderInDb);
    }

    @Override
    public TodayStatisticDto getTodayStatistic(int shopId)  {
        List<Order> orders = orderRepository.findByToday(shopId);
        int totalOrder = orders.size();
        long returnRequestedOrders = orders.stream()
                .filter(o -> o.getOrderStatus() == Order.OrderStatus.RETURN_REQUESTED)
                .count();
        Float totalRevenue = orders.stream()
                .filter(o -> o.getOrderStatus() != Order.OrderStatus.RETURN_REQUESTED)
                .map(Order::getTotal).reduce(0f, Float::sum);

        Integer totalProductSoldToday = orderRepository.getTotalProductSoldToday(shopId);

        Float revenueChangeYesterday = orderRepository.getRevenueChange(1, shopId);

        return new TodayStatisticDto(totalOrder - returnRequestedOrders, totalRevenue, returnRequestedOrders, revenueChangeYesterday, totalProductSoldToday);
    }

    @Override
    public List<RecentOrderDto> getRecentOrders(int shopId) {
        shopId = shopProfileService.getShopIdByUserId(shopId);
        List<Order> recentOrders = orderRepository.findRecentOrders(shopId);

        return recentOrders.stream()
                .map(order -> {
                    RecentOrderDto dto = new RecentOrderDto();
                    dto.setOrderId(order.getId());
                    dto.setCustomerName(order.getCustomer().getFullName());
                    dto.setTotal(order.getTotal());
                    dto.setOrderStatus(order.getOrderStatus().toString());
                    dto.setOrderTime(order.getOrderTime().toString());
                    dto.setDeliveryDate(order.getDeliverDate() != null ?
                            order.getDeliverDate().toString() : null);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<RevenueReportDto> getReportByXMonths(int months, int shopId) {
        return orderRepository.findReportByXMonths(months, shopId);
    }

    @Override
    public List<RevenueReportDto> getReportByDateRange(String startDate, String endDate, int shopId) {
        return orderRepository.findReportByDateRange(startDate, endDate, shopId);
    }

    @Override
    public List<TopProductReportDto> getTopProductReport(String date, int shopId) {
        return orderRepository.findTopProductsByMonth(date, shopId);
    }

    @Override
    public List<OrderOverviewDto> searchOrders(OrderSearchDto searchDto) {
        List<Order> orders = orderRepository.findAll(OrderSpecification.searchByCriteria(searchDto));
        return orders.stream()
                .map(order -> {
                    OrderOverviewDto dto = new OrderOverviewDto();
                    dto.setOrderId(order.getId());
                    dto.setOrderTime(order.getOrderTime().toString());
                    dto.setCustomerName(order.getFirstName() + " " + order.getLastName());
                    dto.setOrderStatus(order.getOrderStatus().toString());
                    dto.setPaymentMethod(order.getPaymentMethod().name());
                    dto.setTotalAmount(order.getTotal());
                    return dto;
                }).collect(Collectors.toList());
    }

    @Override
    public OrderExtraInfo getOrderExtraInfo(int orderId) {
        Order order = orderRepository.findById(orderId).get();
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(orderId);
        if(order == null) {
            return null;
        }
        OrderExtraInfo orderExtraInfo = new OrderExtraInfo();
        orderExtraInfo.setDeliveryDate(order.getDeliverDate().toString());
        orderExtraInfo.setAddress(order.getAddressLine());
        orderExtraInfo.setPhoneNumber(order.getPhoneNumber());
        orderExtraInfo.setNote(order.getNote());

        List<OrderProductsDto> orderProductsDtos = getOrderProductsDtos(orderDetails);
        orderExtraInfo.setOrderProducts(orderProductsDtos);

        return orderExtraInfo;
    }

    @Override
    public OrderDetailDto getOrderDetails(int orderId) {
        OrderDetailDto orderDetailDto = new OrderDetailDto();

        Order order = orderRepository.findById(orderId).get();
        if (order == null) {
            return null;
        }
        orderDetailDto.setOrderId(order.getId());
        orderDetailDto.setCustomerName(order.getFirstName() + " " + order.getLastName());
        orderDetailDto.setPhoneNumber(order.getPhoneNumber());
        orderDetailDto.setAddress(order.getAddressLine());
        orderDetailDto.setOrderTime(order.getOrderTime().toString());
        orderDetailDto.setDeliveryDate(order.getDeliverDate().toString());
        orderDetailDto.setOrderStatus(order.getOrderStatus().toString());
        orderDetailDto.setPaymentMethod(order.getPaymentMethod().name());
        orderDetailDto.setNote(order.getNote());
        orderDetailDto.setShippingFee(order.getShippingCost());
        orderDetailDto.setSubtotal(order.getSubtotal());

        List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(orderId);
        List<OrderProductsDto> orderProductsDtos = getOrderProductsDtos(orderDetails);
        orderDetailDto.setOrderProducts(orderProductsDtos);
        orderDetailDto.setTotalQuantity(orderProductsDtos.stream().mapToInt(OrderProductsDto::getQuantity).sum());
        orderDetailDto.setTotal(order.getTotal());


        return orderDetailDto;
    }

    @Override
    public List<OrderDetailDto> getAllOrderDetails() {
        List<Order> orders = orderRepository.findAll(Sort.by("orderTime").descending());
        List<OrderDetailDto> orderDetailDtos = new ArrayList<>();
        orders.forEach(order -> {
            OrderDetailDto orderDetailDto = new OrderDetailDto();
            orderDetailDto.setOrderId(order.getId());
            orderDetailDto.setCustomerName(order.getFirstName() + " " + order.getLastName());
            orderDetailDto.setPhoneNumber(order.getPhoneNumber());
            orderDetailDto.setAddress(order.getAddressLine());
            orderDetailDto.setOrderTime(order.getOrderTime().toString());
            orderDetailDto.setDeliveryDate(order.getDeliverDate().toString());
            orderDetailDto.setOrderStatus(order.getOrderStatus().toString());
            orderDetailDto.setPaymentMethod(order.getPaymentMethod().name());
            orderDetailDto.setNote(order.getNote());
            orderDetailDto.setShippingFee(order.getShippingCost());
            orderDetailDto.setSubtotal(order.getSubtotal());

            List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(order.getId());
            List<OrderProductsDto> orderProductsDtos = getOrderProductsDtos(orderDetails);
            orderDetailDto.setOrderProducts(orderProductsDtos);
            orderDetailDto.setTotalQuantity(orderProductsDtos.stream().mapToInt(OrderProductsDto::getQuantity).sum());
            orderDetailDto.setTotal(order.getTotal());

            orderDetailDtos.add(orderDetailDto);
        });

        return orderDetailDtos;
    }

    @Override
    public void updateOrderStatus(int orderId, String status) {
        orderRepository.findById(orderId).ifPresent(order -> {
            order.setOrderStatus(Order.OrderStatus.valueOf(status));
            orderRepository.save(order);

            OrderTrack orderTrack = new OrderTrack();
            orderTrack.setOrder(order);
            orderTrack.setStatus(OrderTrack.OrderStatus.valueOf(status));
            orderTrack.setUpdatedTime(new Date());
            orderTrack.setNotes("Cập nhật trạng thái đơn hàng thành " + status);
            orderTrackRepository.save(orderTrack);

            // Nếu đơn hàng đã giao thành công và phương thức thanh toán là COD
            if (order.getOrderStatus() == Order.OrderStatus.DELIVERED &&
                    order.getPaymentMethod() == Order.PaymentMethod.COD) {
                // Tạo escrow cho COD
                escrowService.createCODEscrow(order, shopProfileService.getShopWallet(order.getShopId()), BigDecimal.valueOf(order.getTotal()));
            }
        });
    }

    @NotNull
    private static List<OrderProductsDto> getOrderProductsDtos(List<OrderDetail> orderDetails) {
        List<OrderProductsDto> orderProductsDtos = orderDetails.stream().map(orderDetail -> {
            OrderProductsDto orderProductsDto = new OrderProductsDto();
            Product product = orderDetail.getProduct();
            orderProductsDto.setProductId(product.getId());
            orderProductsDto.setProductName(product.getName());
            orderProductsDto.setQuantity(orderDetail.getQuantity());
            orderProductsDto.setProductPrice(product.getPrice());
            orderProductsDto.setDiscount(product.getPrice() * product.getDiscountPercent() / 100);
            orderProductsDto.setProductAfterDiscount(orderDetail.getUnitPrice());
            orderProductsDto.setTotalPrice(orderDetail.getSubtotal());

            return orderProductsDto;
        }).collect(Collectors.toList());
        return orderProductsDtos;
    }
}

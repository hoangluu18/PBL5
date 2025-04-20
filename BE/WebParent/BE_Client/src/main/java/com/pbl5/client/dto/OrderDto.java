package com.pbl5.client.dto;

import com.pbl5.common.entity.Order;
import com.pbl5.common.entity.Order.OrderStatus;
import com.pbl5.common.entity.Order.PaymentMethod;
import lombok.Data;

import java.util.Date;

@Data
public class OrderDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String addressLine;
    private Date orderTime;
    private String city;
    private Date deliverDate;
    private Integer deliverDays;
    private Float productCost;
    private Float shippingCost;
    private Float subtotal;
    private Float total;
    private OrderStatus orderStatus;
    private PaymentMethod paymentMethod;
    private Integer customerId;
    private Integer shopId;

    // Constructor để map từ Order entity
    public OrderDto(Order order) {
        this.id = Long.valueOf(order.getId());
        this.firstName = order.getFirstName();
        this.lastName = order.getLastName();
        this.phoneNumber = order.getPhoneNumber();
        this.addressLine = order.getAddressLine();
        this.orderTime = order.getOrderTime();
        this.city = order.getCity();
        this.deliverDate = order.getDeliverDate();
        this.deliverDays = order.getDeliverDays();
        this.productCost = order.getProductCost();
        this.shippingCost = order.getShippingCost();
        this.subtotal = order.getSubtotal();
        this.total = order.getTotal();
        this.orderStatus = order.getOrderStatus();
        this.paymentMethod = order.getPaymentMethod();
        this.customerId = order.getCustomer().getId();
        this.shopId = order.getShopId();
    }
}
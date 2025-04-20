package com.pbl5.common.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order extends IdBaseEntity {

    @Column(name = "first_name", nullable = false, length = 45)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 45)
    private String lastName;

    @Column(name = "phone_number", nullable = false, length = 15)
    private String phoneNumber;

    @Column(name = "address_line", nullable = false, length = 255)
    private String addressLine;

    @Column(name = "order_time", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @OrderBy("DESC")
    private Date orderTime;

    @Column(name = "city", nullable = false, length = 45)
    private String city;

    @Column(name = "deliver_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date deliverDate;

    @Column(name = "deliver_days", nullable = false)
    private Integer deliverDays;

    @Column(name = "product_cost", nullable = false)
    private Float productCost;

    @Column(name = "shipping_cost", nullable = false)
    private Float shippingCost;

    @Column(name = "subtotal", nullable = false)
    private Float subtotal;

    @Column(name = "total", nullable = false)
    private Float total;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false)
    private OrderStatus orderStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Column(name = "customer_id", nullable = false)
    private Integer customerId;

    @Column(name = "shop_id", nullable = false)
    private Integer shopId;

    // Quan hệ Many-to-One với Customer (nếu cần)
    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Customer customer;

    // Quan hệ Many-to-One với Shop (giả sử có entity Shop)
    @ManyToOne
    @JoinColumn(name = "shop_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Shop shop;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("updatedTime DESC")
    private List<OrderTrack> orderTracks = new ArrayList<>();

    // Enum cho order_status
    public enum OrderStatus {
        DELIVERED, NEW, PACKAGED, PAID, PICKED, PROCCESSING, REFUNDED, RETURNED, SHIPPING, RETURN_REQUESTED
    }

    // Enum cho payment_method
    public enum PaymentMethod {
        COD, CREDIT_CARD, PAYPAL
    }
}
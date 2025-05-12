package com.pbl5.admin.dto.orders;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

public class OrderDto {
    private Integer id;
    private LocalDateTime orderTime;
    private Double total;
    private String orderStatus;

    public OrderDto(Integer id, Date orderTime, Float total, String orderStatus) {
        this.id = id;
        // Chuyển đổi orderTime từ Date sang LocalDateTime
        this.orderTime = orderTime.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
        // Chuyển đổi total từ Float sang Double
        this.total = total.doubleValue();
        // Chuyển orderStatus thành String
        this.orderStatus = orderStatus;
    }


    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public LocalDateTime getOrderTime()     { return orderTime; }
    public void setOrderTime(LocalDateTime orderTime) { this.orderTime = orderTime; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }
}

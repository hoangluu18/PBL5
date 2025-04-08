package com.pbl5.client.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Data
@AllArgsConstructor
public class ProfileDto {
    private Integer id;
    private Integer customerId;
    private String fullName;
    private String avatar;
    private Date createdAt;
    private double totalSpent;      // Tổng chi tiêu (dùng double thay vì Float)
    private Date lastOrder;         // Thời gian đơn hàng gần nhất
    private Integer totalOrder;     // Tổng số đơn hàng
    private List<String> address;   // Danh sách địa chỉ
    private String defaultAddress;
    private String email;
    private String phone;
}
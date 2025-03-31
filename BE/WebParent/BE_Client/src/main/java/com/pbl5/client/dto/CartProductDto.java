package com.pbl5.client.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@Data
@AllArgsConstructor
public class CartProductDto {
    private Integer productId;
    private String productName;
    private Integer quantity;
    private double originalPrice;  // Giá gốc
    private double discountPercent;  // Phần trăm giảm giá
    private double lastPrice;  // Giá cuối cùng sau giảm giá
    private String photo;
    private String shopName;
    private String attributes; // Lưu các thuộc tính key-value (VD: {"Size": "L", "Color": "Gray"})
}

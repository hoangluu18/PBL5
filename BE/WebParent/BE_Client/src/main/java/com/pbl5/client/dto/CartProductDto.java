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
    private Long id;
    private Integer productId;
    private String productName;
    private String productAlias;
    private Integer quantity;
    private double originalPrice;  // Giá gốc
    private double discountPercent;  // Phần trăm giảm giá
    private double lastPrice;  // Giá cuối cùng sau giảm giá
    private String photo;
    private String shopName;
    private Integer shopId;
    private String attributes; // Lưu các thuộc tính key-value (VD: {"Size": "L", "Color": "Gray"})
    private boolean isReviewed;
}

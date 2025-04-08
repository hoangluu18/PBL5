package com.pbl5.client.dto;

import lombok.Data;

@Data
public class AddToCartDto {

    private int customerId;
    private int productId;
    private int quantity;
    private String productDetail;
}

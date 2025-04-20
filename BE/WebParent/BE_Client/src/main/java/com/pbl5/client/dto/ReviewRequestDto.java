package com.pbl5.client.dto;

import lombok.Data;

@Data
public class ReviewRequestDto {

    private Integer productId;
    private Integer customerId;
    private int rating;
    private String content;
}

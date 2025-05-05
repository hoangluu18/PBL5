package com.pbl5.admin.dto.shop;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDto {
    private Integer id;
    private Integer productId;
    private String customerName;
    private String customerPhoto;
    private int rating;
    private String content;
    private Date created_at;
    private String feedback;
    private int votes;
    private boolean votedByCurrentCustomer;

    // Constructors, getters, setters...
}

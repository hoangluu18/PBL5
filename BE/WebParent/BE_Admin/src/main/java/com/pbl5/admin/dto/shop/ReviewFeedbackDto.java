package com.pbl5.admin.dto.shop;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewFeedbackDto {
    private Integer reviewId;
    private String feedback;

    // Constructors, getters, setters...
}

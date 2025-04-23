package com.pbl5.admin.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ResponseDto {

    private String message;
    private Object data;
    private int statusCode;

    public ResponseDto(String message, Object data, int statusCode) {
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
    }

    public ResponseDto(String message, int statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}

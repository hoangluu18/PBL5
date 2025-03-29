package com.pbl5.client.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class ErrorDto {

    private Date timestamp;
    private int status;
    private List<String> errors = new ArrayList<>();

    public void addError(String message) {
        errors.add(message);
    }
}

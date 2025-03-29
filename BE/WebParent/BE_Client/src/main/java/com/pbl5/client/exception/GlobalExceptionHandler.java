package com.pbl5.client.exception;

import com.pbl5.client.dto.ErrorDto;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@ControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorDto handleException(Exception e) {
        ErrorDto errorDto = new ErrorDto();

        errorDto.setTimestamp(new Date());
        errorDto.setStatus(HttpStatus.BAD_REQUEST.value());
        errorDto.addError(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());

        return errorDto;
    }
}

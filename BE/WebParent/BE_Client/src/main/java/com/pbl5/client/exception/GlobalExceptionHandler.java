package com.pbl5.client.exception;

import com.pbl5.client.dto.ErrorDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Date;
import java.util.List;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private final static Logger LOGGER = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                            HttpHeaders headers, HttpStatusCode status, WebRequest request) {

        ErrorDto errorDto = new ErrorDto();
        errorDto.setTimestamp(new Date());
        errorDto.setStatus(HttpStatus.BAD_REQUEST.value());

        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
        fieldErrors.forEach(e -> {
            errorDto.addError(e.getField() + ": " + e.getDefaultMessage());
        });

        return new ResponseEntity<>(errorDto, headers, status);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorDto handleException(Exception e) {
        ErrorDto errorDto = new ErrorDto();

        errorDto.setTimestamp(new Date());
        errorDto.setStatus(HttpStatus.BAD_REQUEST.value());
        errorDto.addError(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());

        return errorDto;
    }

    @ExceptionHandler(JwtValidationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ResponseBody
    public ErrorDto handleJwtValidationException(HttpServletRequest request, Exception ex) {
        ErrorDto errorDTO = new ErrorDto();

        errorDTO.setTimestamp(new Date());
        errorDTO.setStatus(HttpStatus.UNAUTHORIZED.value());
        errorDTO.addError(ex.getMessage());

        LOGGER.error(ex.getMessage(), ex);

        return errorDTO;
    }
}

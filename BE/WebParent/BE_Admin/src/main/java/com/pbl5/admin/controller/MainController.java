package com.pbl5.admin.controller;

import com.pbl5.admin.dto.ResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class MainController {

    @GetMapping("/")
    public ResponseEntity<ResponseDto> index() {
        ResponseDto responseDto = new ResponseDto();

        Map<String, Object> data = Map.of(
                "id", 2,
                "name", "Admin API",
                "logo", "https://example.com/logo.png"
                );


        responseDto.setData(data);
        responseDto.setMessage("Welcome to Admin API");
        responseDto.setStatusCode(200);

        return ResponseEntity.ok(responseDto);
    }
}

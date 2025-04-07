package com.pbl5.client.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainRestController {

    @GetMapping("/")
    @CrossOrigin(origins = "*")
    public String index() {
        return "index for client";
    }
}

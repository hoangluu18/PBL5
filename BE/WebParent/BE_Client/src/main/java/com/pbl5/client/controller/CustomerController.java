package com.pbl5.client.controller;

import com.pbl5.client.common.Constants;
import com.pbl5.client.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(Constants.FE_URL)
public class CustomerController {

    @Autowired private CustomerService customerService;

    @PostMapping("/checkUniqueEmail")
    public boolean checkUniqueEmail(String email) {
        boolean isUnique = customerService.checkIsUniqueEmail(email);
        System.out.println(email + " is unique: " + isUnique);
        return customerService.checkIsUniqueEmail(email);
    }
}

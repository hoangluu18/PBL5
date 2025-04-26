package com.pbl5.admin.service;

import com.pbl5.admin.dto.CustomerDto;

import java.util.List;

public interface CustomerService {
    List<CustomerDto> findAllCustomers();
}

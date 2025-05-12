package com.pbl5.admin.service;

import com.pbl5.admin.dto.CustomerDto;

import java.util.List;

public interface CustomerService {
    List<CustomerDto> findAllCustomers();

    CustomerDto findCustomerById(Integer id);

    public List<CustomerDto> findCustomersByShopId(Integer shopId);
}

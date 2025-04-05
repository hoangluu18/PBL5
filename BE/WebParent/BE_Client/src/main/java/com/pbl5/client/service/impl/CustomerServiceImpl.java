package com.pbl5.client.service.impl;

import com.pbl5.client.repository.CustomerRepository;
import com.pbl5.client.service.CustomerService;
import com.pbl5.common.entity.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerServiceImpl implements CustomerService {
    @Autowired
    private CustomerRepository customerRepository;
    @Override
    public Customer fineByCustomerId(Integer customerId) {
        if(customerId == null) {
            return null;
        }
        try {
            return customerRepository.findById(customerId).orElse(null);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

package com.pbl5.client.service.impl;


import com.pbl5.client.exception.CustomerNotFoundException;
import com.pbl5.client.repository.CustomerRepository;
import com.pbl5.client.service.CustomerService;
import com.pbl5.common.entity.Customer;
import jakarta.transaction.Transactional;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void registerCustomer(Customer customer) {
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        customer.setCreatedAt(new Date());
        customer.setEnabled(false);

        String random = RandomStringUtils.randomAlphabetic(64);
        customer.setVerificationCode(random);

        customerRepository.save(customer);
    }

    @Override
    public boolean verify(String verificationCode) {
        Customer customer = customerRepository.findByVerificationCode(verificationCode);

        if(customer == null || customer.isEnabled()) {
            return false;
        }else {
            customerRepository.enable(customer.getId());
            return true;
        }
    }

    @Override
    public boolean checkIsUniqueEmail(String email) {
        Customer customer = customerRepository.findByEmail(email);
        return customer == null;
    }

    @Override
    public Customer findByEmail(String email) throws CustomerNotFoundException {
        Customer customer = customerRepository.findByEmail(email);
        if(customer == null) {
            throw new CustomerNotFoundException("Người dùng không tồn tại với email: " + email);
        }
        return customer;
    }
  
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

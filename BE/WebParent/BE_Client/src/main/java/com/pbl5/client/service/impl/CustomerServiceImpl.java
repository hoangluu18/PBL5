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
import java.util.Optional;

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

    @Override
    public Optional<Customer> getCustomerById(Integer customerId) {
        if(customerId == null) {
            return Optional.empty();
        }
        try {
            return customerRepository.findById(customerId);
        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }
    public Customer findByResetPasswordToken(String token) throws CustomerNotFoundException {
        Customer customer = customerRepository.findByResetPasswordToken(token);
        if (customer == null) {
            throw new CustomerNotFoundException("Người dùng không tồn tại với mã xác thực: " + token);
        }
        return customer;
    }

    @Override
    public Customer updateResetPasswordToken(String email) throws CustomerNotFoundException {
        Customer customer = customerRepository.findByEmail(email);
        if(customer != null) {
            String token = RandomStringUtils.randomAlphanumeric(30);
            customer.setResetPasswordToken(token);
            return customerRepository.save(customer);
        } else {
            throw new CustomerNotFoundException("Không tìm thấy người dùng với email: " + email);
        }
    }

    @Override
    public void saveCustomer(Customer customer) {
        if(customer == null) {
            throw new IllegalArgumentException("Khách hàng không được null");
        }
        try {
            customerRepository.save(customer);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi lưu khách hàng: " + e.getMessage());
        }
    }
    public void updatePassword(String token, String newPassword) throws CustomerNotFoundException {
        Customer customer = customerRepository.findByResetPasswordToken(token);
        if(customer == null) {
            throw new CustomerNotFoundException("Không tìm thấy người dùng với mã xác thực: " + token);
        }
        customer.setPassword(passwordEncoder.encode(newPassword));
        customer.setResetPasswordToken(null);
        customerRepository.save(customer);
    }
}

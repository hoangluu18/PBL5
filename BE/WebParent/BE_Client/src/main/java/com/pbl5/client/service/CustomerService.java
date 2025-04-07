package com.pbl5.client.service;


import com.pbl5.client.exception.CustomerNotFoundException;
import com.pbl5.common.entity.Customer;

public interface CustomerService {

    void registerCustomer(Customer customer);

    boolean verify(String verificationCode);

    boolean checkIsUniqueEmail(String email);

    Customer findByEmail(String email) throws CustomerNotFoundException;

    Customer fineByCustomerId(Integer customerId);

}

package com.pbl5.client.service;


import com.pbl5.client.exception.CustomerNotFoundException;
import com.pbl5.common.entity.Customer;

import java.util.Optional;

public interface CustomerService {

    void registerCustomer(Customer customer);

    boolean verify(String verificationCode);

    boolean checkIsUniqueEmail(String email);

    Customer findByEmail(String email) throws CustomerNotFoundException;

    Customer fineByCustomerId(Integer customerId);

    Optional<Customer> getCustomerById(Integer customerId);

    void saveCustomer(Customer customer);
}

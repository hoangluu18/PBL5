package com.pbl5.client.security;

import com.pbl5.client.repository.CustomerRepository;
import com.pbl5.common.entity.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired private CustomerRepository customerRepository;

    @Override
    public CustomUserDetails loadUserByUsername(String email) {
        Customer customer = customerRepository.findByEmail(email);
        if (customer == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return new CustomUserDetails(customer);
    }
}

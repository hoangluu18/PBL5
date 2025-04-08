package com.pbl5.client.security.jwt;

import com.pbl5.client.dto.auth.AuthResponse;
import com.pbl5.common.entity.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse generateToken(Customer customer) {

        String accessToken = jwtUtil.generateAccessToken(customer);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setAccessToken(accessToken);
        authResponse.setId(customer.getId());
        authResponse.setEmail(customer.getEmail());
        authResponse.setUsername(customer.getFullName());
        authResponse.setAvatar(customer.getAvatar());
        authResponse.setPhoneNumber(customer.getPhoneNumber());

        return authResponse;
    }
}

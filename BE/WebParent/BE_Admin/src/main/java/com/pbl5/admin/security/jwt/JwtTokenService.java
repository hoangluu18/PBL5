package com.pbl5.admin.security.jwt;

import com.pbl5.admin.dto.auth.AuthResponse;
import com.pbl5.common.entity.Customer;
import com.pbl5.common.entity.Role;
import com.pbl5.common.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse generateToken(User user) {

        String accessToken = jwtUtil.generateAccessToken(user);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setAccessToken(accessToken);
        authResponse.setId(user.getId());
        if(user.getRoles().stream().map(Role::getName).anyMatch(r -> r.equals("Seller"))){
            authResponse.setName(user.getShop().getName());
            authResponse.setPhoto(user.getShop().getPhoto());
        }else if (user.getRoles().stream().map(Role::getName).anyMatch(r -> r.equals("Logistic"))) {
            authResponse.setName(user.getFirstName() + " " + user.getLastName());
            authResponse.setPhoto(user.getPhoto());

        } else if (user.getRoles().stream().map(Role::getName).anyMatch(r -> r.equals("Admin"))) {
            authResponse.setName(user.getFirstName() + " " + user.getLastName());
            authResponse.setPhoto(user.getPhoto());
        }
        else if (user.getRoles().stream().map(Role::getName).anyMatch(r -> r.equals("Admin"))) {
            authResponse.setName(user.getFirstName() + " " + user.getLastName());
            authResponse.setPhoto(user.getPhoto());
        }

        authResponse.setRoles(user.getRoles().stream().map(Role::getName).toList());


        return authResponse;
    }
}

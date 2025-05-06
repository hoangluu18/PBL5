package com.pbl5.admin.service.impl;

import com.pbl5.admin.exception.UserNotFoundException;
import com.pbl5.admin.repository.UserRepository;
import com.pbl5.admin.service.UserService;
import com.pbl5.common.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User findByEmail(String email) throws UserNotFoundException {
        User user = userRepository.findByEmail(email);
        if(user == null){
            throw new UserNotFoundException("Could not find any user with email: " + email);
        }
        return user;
    }

}

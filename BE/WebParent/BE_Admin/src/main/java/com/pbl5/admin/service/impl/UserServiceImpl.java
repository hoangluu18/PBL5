package com.pbl5.admin.service.impl;

import com.pbl5.admin.dto.UserDto;
import com.pbl5.admin.exception.UserNotFoundException;
import com.pbl5.admin.repository.UserRepository;
import com.pbl5.admin.service.UserService;
import com.pbl5.common.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User findById(Integer id) throws UserNotFoundException {
        User user = userRepository.findById(id).orElse(null);
        if(user == null){
            throw new UserNotFoundException("Could not find any user with ID: " + id);
        }
        return user;
    }


    @Override
    public User findByEmail(String email) throws UserNotFoundException {
        User user = userRepository.findByEmail(email);
        if(user == null){
            throw new UserNotFoundException("Could not find any user with email: " + email);
        }
        return user;
    }

    @Override
    public User save(UserDto user) {
        User existingUser = userRepository.findById(user.getId()).get();
        existingUser.setEmail(user.getEmail());
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setPhoto(user.getPhoto());

        return userRepository.save(existingUser);
    }

}

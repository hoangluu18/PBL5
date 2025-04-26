package com.pbl5.admin.service;

import com.pbl5.admin.dto.CustomerDto;
import com.pbl5.admin.exception.UserNotFoundException;
import com.pbl5.common.entity.User;

import java.util.List;

public interface UserService {

    public User findByEmail(String email) throws UserNotFoundException;

}

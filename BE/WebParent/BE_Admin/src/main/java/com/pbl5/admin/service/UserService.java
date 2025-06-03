package com.pbl5.admin.service;

import com.pbl5.admin.dto.UserDto;
import com.pbl5.admin.exception.UserNotFoundException;
import com.pbl5.common.entity.User;

public interface UserService {

    User findById(Integer id) throws UserNotFoundException;

    User findByEmail(String email) throws UserNotFoundException;

    User save(UserDto user);
}

package com.pbl5.admin.service;

import com.pbl5.admin.exception.UserNotFoundException;
import com.pbl5.common.entity.User;

public interface UserService {

    public User findByEmail(String email) throws UserNotFoundException;
}

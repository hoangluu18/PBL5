package com.pbl5.admin.service;

import com.pbl5.admin.dto.CustomerDto;
import com.pbl5.admin.dto.PasswordChangeDto;
import com.pbl5.admin.dto.UserProfileDto;
import com.pbl5.admin.exception.UserNotFoundException;
import com.pbl5.common.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UserService {

    public User findByEmail(String email) throws UserNotFoundException;
    UserProfileDto getUserProfile(Integer userId) throws UserNotFoundException;
    UserProfileDto updateUserProfile(Integer userId, UserProfileDto profileDto) throws UserNotFoundException;
    boolean changePassword(Integer userId, PasswordChangeDto passwordChangeDto) throws UserNotFoundException;
    UserProfileDto updateUserPhoto(Integer userId, MultipartFile file) throws UserNotFoundException, IOException;

}

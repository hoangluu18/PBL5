package com.pbl5.admin.service.impl;

import com.pbl5.admin.dto.PasswordChangeDto;
import com.pbl5.admin.dto.UserProfileDto;
import com.pbl5.admin.exception.UserNotFoundException;
import com.pbl5.admin.repository.UserRepository;
import com.pbl5.admin.service.UserService;
import com.pbl5.admin.service.aws.S3StorageService;
import com.pbl5.common.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private S3StorageService s3StorageService;

    @Override
    public User findByEmail(String email) throws UserNotFoundException {
        User user = userRepository.findByEmail(email);
        if(user == null){
            throw new UserNotFoundException("Could not find any user with email: " + email);
        }
        return user;
    }

    @Override
    public UserProfileDto getUserProfile(Integer userId) throws UserNotFoundException {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new UserNotFoundException("Không tìm thấy người dùng với ID: " + userId);
        }

        User user = userOpt.get();
        return convertToDto(user);
    }

    @Override
    public UserProfileDto updateUserProfile(Integer userId, UserProfileDto profileDto) throws UserNotFoundException {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new UserNotFoundException("Không tìm thấy người dùng với ID: " + userId);
        }

        User user = userOpt.get();
        user.setFirstName(profileDto.getFirstName());
        user.setLastName(profileDto.getLastName());

        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    @Override
    public boolean changePassword(Integer userId, PasswordChangeDto passwordChangeDto) throws UserNotFoundException {
        if (!passwordChangeDto.getNewPassword().equals(passwordChangeDto.getConfirmPassword())) {
            throw new IllegalArgumentException("Mật khẩu mới và xác nhận mật khẩu không khớp");
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new UserNotFoundException("Không tìm thấy người dùng với ID: " + userId);
        }

        User user = userOpt.get();

        // Kiểm tra mật khẩu hiện tại
        if (!passwordEncoder.matches(passwordChangeDto.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu hiện tại không chính xác");
        }

        // Cập nhật mật khẩu
        user.setPassword(passwordEncoder.encode(passwordChangeDto.getNewPassword()));
        userRepository.save(user);

        return true;
    }

    @Override
    public UserProfileDto updateUserPhoto(Integer userId, MultipartFile file) throws UserNotFoundException, IOException {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new UserNotFoundException("Không tìm thấy người dùng với ID: " + userId);
        }

        User user = userOpt.get();

        // Xóa ảnh cũ trên S3 nếu có
        if (user.getPhotos() != null && !user.getPhotos().isEmpty()) {
            s3StorageService.deleteFile(user.getPhotos());
        }

        // Upload ảnh mới lên S3 với thư mục users
        String imageUrl = s3StorageService.uploadFile(file, "avatars/");

        // Cập nhật đường dẫn ảnh trong database
        user.setPhotos(imageUrl);
        User savedUser = userRepository.save(user);

        return convertToDto(savedUser);
    }

    private UserProfileDto convertToDto(User user) {
        return new UserProfileDto(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhotos(),
                user.isEnabled()
        );
    }

}

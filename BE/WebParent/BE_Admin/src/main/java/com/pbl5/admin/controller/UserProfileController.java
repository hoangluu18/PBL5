package com.pbl5.admin.controller;

import com.pbl5.admin.dto.PasswordChangeDto;
import com.pbl5.admin.dto.UserProfileDto;
import com.pbl5.admin.exception.UserNotFoundException;
import com.pbl5.admin.service.UserService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
@RestController
@RequestMapping("/api/users/profile")
@CrossOrigin(origins = "*")
public class UserProfileController {

    @Autowired
    private UserService userProfileService;

    private final String uploadDir = "user-photos/";

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable Integer userId) {
        try {
            UserProfileDto profile = userProfileService.getUserProfile(userId);
            return ResponseEntity.ok(profile);
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable Integer userId,
            @RequestBody @Valid UserProfileDto profileDto) {
        try {
            UserProfileDto updatedProfile = userProfileService.updateUserProfile(userId, profileDto);
            return ResponseEntity.ok(updatedProfile);
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{userId}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable Integer userId,
            @RequestBody @Valid PasswordChangeDto passwordChangeDto) {
        try {
            boolean success = userProfileService.changePassword(userId, passwordChangeDto);
            if (success) {
                return ResponseEntity.ok("Đổi mật khẩu thành công");
            } else {
                return ResponseEntity.badRequest().body("Đổi mật khẩu thất bại");
            }
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Tải lên ảnh đại diện
    @PostMapping(value = "/{userId}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadPhoto(
            @PathVariable Integer userId,
            @RequestParam("file") MultipartFile file) {
        try {
            // Kiểm tra file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Vui lòng chọn file ảnh");
            }

            // Upload ảnh và cập nhật người dùng
            UserProfileDto updatedUser = userProfileService.updateUserPhoto(userId, file);

            return ResponseEntity.ok(updatedUser);
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Không thể tải lên ảnh: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
package com.pbl5.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordChangeDto {
    @NotBlank(message = "Mật khẩu hiện tại không được để trống")
    private String currentPassword;

    @NotBlank(message = "Mật khẩu mới không được để trống")
    @Length(min = 6, message = "Mật khẩu mới phải có ít nhất 6 ký tự")
    private String newPassword;

    @NotBlank(message = "Xác nhận mật khẩu không được để trống")
    private String confirmPassword;
}
package com.pbl5.admin.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {

    @Email(message = "Email không hợp lệ")
    private String email;

    @NotNull(message = "Mật khẩu không được để trống")
    @Length(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String password;
}

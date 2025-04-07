package com.pbl5.client.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;
    private Integer id;
    private String email;
    private String username;
    private String avatar;
    private String phoneNumber;
}

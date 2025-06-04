package com.pbl5.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private Integer id;
    private String email;
    private String firstName;
    private String lastName;
    private String photos;
    private boolean enabled;
}

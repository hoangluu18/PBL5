package com.pbl5.common.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "customers")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer extends IdBaseEntity{
    @Column(name = "first_name", nullable = false, length = 45)
    @NotNull(message = "First name không được để trống")
    @Length(min = 2, max = 20, message = "First name không được quá 45 ký tự")
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 45)
    @NotNull(message = "Last name không được để trống")
    @Length(min = 2, max = 20, message = "Last name không được quá 45 ký tự")
    private String lastName;

    @Column(nullable = false, unique = true, length = 45)
    @NotNull(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @Column(nullable = false, length = 64)
    @NotNull(message = "Mật khẩu không được để trống")
    @Length(min = 6, max = 64, message = "Mật khẩu trên 6 ký tự và không được quá 64 ký tự")
    private String password;

    @Column(name = "phone_number", nullable = false, length = 15)
    @NotNull(message = "Số điện thoại không được để trống")
    @Length(min = 8, max = 15, message = "Số điện thoại không được quá 15 ký tự")
    private String phoneNumber;

    @Column(length = 128)
    private String avatar;

    @Column(nullable = false)
    private boolean enabled;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "verification_code", length = 64)
    private String verificationCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "authentication_type")
    private AuthenticationType authenticationType;

    @Column(name = "reset_password_token", length = 30)
    private String resetPasswordToken;

    public Customer(int id) {
        this.id = id;
    }

    public String getFullName() {
        return lastName + " " + firstName;
    }



    public enum AuthenticationType {
        DATABASE, FACEBOOK, GOOGLE
    }


    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ShopTracking> shopTrackingList;
}


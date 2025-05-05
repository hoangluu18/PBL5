package com.pbl5.admin.dto;


public class CustomerDto {
    private Integer id;
    private String fullName;
    private String phone;
    private Double totalSpending;
    private String email;
    private String avatar;

    // Constructor
    public CustomerDto(Integer id, String fullName, String phone, Double totalSpending, String email, String avatar) {
        this.id = id;
        this.fullName = fullName;
        this.phone = phone;
        this.totalSpending = totalSpending;
        this.email = email;
        this.avatar = avatar;
    }

    // Getters and Setters
    public Integer getId() { return id; }

    public void setId(Integer id) { this.id = id; }

    public String getFullName() { return fullName; }

    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }

    public void setPhone(String phone) { this.phone = phone; }

    public Double getTotalSpending() { return totalSpending; }

    public void setTotalSpending(Double totalSpending) { this.totalSpending = totalSpending; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getAvatar() { return avatar; }

    public void setAvatar(String avatar) { this.avatar = avatar; }
}


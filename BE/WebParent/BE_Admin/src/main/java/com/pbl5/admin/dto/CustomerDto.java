package com.pbl5.admin.dto;


public class CustomerDto {
    private Integer id;
    private String fullName;
    private String phone;
    private Double totalSpending;

    // Constructor
    public CustomerDto(Integer id, String fullName, String phone, Double totalSpending) {
        this.id = id;
        this.fullName = fullName;
        this.phone = phone;
        this.totalSpending = totalSpending;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Double getTotalSpending() {
        return totalSpending;
    }

    public void setTotalSpending(Double totalSpending) {
        this.totalSpending = totalSpending;
    }
}


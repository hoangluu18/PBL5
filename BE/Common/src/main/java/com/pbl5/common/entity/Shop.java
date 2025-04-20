package com.pbl5.common.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "shops")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Shop extends IdBaseEntity{

    @Column(nullable = false, unique = true, length = 256)
    private String name;
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    private boolean enabled;

    private String address;

    private String photo;
    private Float rating;
    private Integer productAmount;
    private Integer peopleTracking;

    private String phone;

    private String city;
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Shop(int shopId) {
        this.id = shopId;
    }
}

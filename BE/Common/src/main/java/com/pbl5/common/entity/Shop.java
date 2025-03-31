package com.pbl5.common.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "shops")
@Getter
@Setter
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
    private Integer rating;
    private Integer productAmount;
    private Integer peopleTracking;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}

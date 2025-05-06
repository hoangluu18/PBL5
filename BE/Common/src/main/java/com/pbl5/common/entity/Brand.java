package com.pbl5.common.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "brands")
@Getter
@Setter
public class Brand extends IdBaseEntity {

    @Column(name = "name", length = 45, nullable = false, unique = true)
    private String name;

    @Column(name = "logo", length = 255, unique = true)
    private String logo;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "brands_categories",
            joinColumns = @JoinColumn(name = "brand_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<Category> categories = new HashSet<>();
}

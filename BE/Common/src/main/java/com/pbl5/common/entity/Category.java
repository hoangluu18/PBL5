package com.pbl5.common.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.*;

@Entity
@Table(name = "categories")
@Getter
@Setter
public class Category extends IdBaseEntity{

    @Column(length = 128, nullable = false, unique = true)
    private String name;

    @Column(length = 64, nullable = false, unique = true)
    private String alias;

    @Column(length = 128, nullable = false)
    private String image;

    private boolean enabled;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    @OneToMany(mappedBy = "parent")
    @OrderBy("name asc")
    private List<Category> children = new ArrayList<>();

    @Column(name = "all_parent_ids", length = 256)
    private String allParentIds;

    @ManyToMany(mappedBy = "categories", fetch = FetchType.LAZY)
    private List<Brand> brands = new ArrayList<>();

    public Category() {
    }

    public Category(int id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object obj) {
        if(this == obj){
            return true;
        }

        if (!(obj instanceof Category that)) {
            return false;
        }

        return Objects.equals(that.getId(), this.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(this.getId());
    }

    @Override
    public String toString() {
        return "Category{" +
                "id=" + id +
                "name='" + name + '\'' +
                ", alias='" + alias + '\'' +
                ", image='" + image + '\'' +
                ", enabled=" + enabled +
                '}' + "\n" ;
    }
}
package com.pbl5.common.entity.product;


import com.pbl5.common.entity.Brand;
import com.pbl5.common.entity.Category;
import com.pbl5.common.entity.IdBaseEntity;
import com.pbl5.common.entity.Shop;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
public class Product extends IdBaseEntity {

    @Column(nullable = false, unique = true, length = 256)
    private String name;

    @Column(nullable = false, unique = true, length = 256)
    private String alias;

    @Column(name = "full_description", nullable = false, columnDefinition = "TEXT")
    private String fullDescription;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    private boolean enabled;

    @Column(name = "in_stock")
    private boolean inStock;

    @Column(name = "main_image", nullable = false)
    private String mainImage;

    private float cost;

    private float price;

    @Column(name = "discount_percent")
    private float discountPercent;

    private float length;
    private float width;
    private float height;
    private float weight;

    @Column(name="review_count")
    private int reviewCount;

    @Column(name = "average_rating")
    private float averageRating;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductDetail> productDetails = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductImage> images = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductVariant> variants = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id")
    private Shop shop;

    public Product(int id) {
        this.id = id;
    }


    @Override
    public boolean equals(Object obj) {
        if(this == obj){
            return true;
        }

        if (!(obj instanceof Product that)) {
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
        return "Product{" +
                "name='" + name + '\'' +
                ", category name=" + category.getName() +
                ", brand name=" + brand.getName() +
                '}';
    }

    @PrePersist
    protected void onCreate(){
        this.updatedAt = new Date();
    }
    @PreUpdate
    protected void onUpdate(){
        this.updatedAt = new Date();
    }
}

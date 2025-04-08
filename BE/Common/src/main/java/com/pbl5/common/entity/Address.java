package com.pbl5.common.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Table(name = "addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address extends IdBaseEntity {

    @Column(name = "customer_id", nullable = false)
    private Integer customerId;

    @Column(name = "full_name", nullable = false, length = 45)
    private String fullName;

    @Column(name = "phone_number", nullable = false, length = 15)
    private String phoneNumber;

    @Column(name = "address", nullable = false, length = 100)
    private String address;

    @Column(name = "city", nullable = false, length = 45)
    private String city;

    @Column(name = "is_default", nullable = false)
    @ColumnDefault("0")
    private boolean isDefault;

    // Quan hệ Many-to-One với Customer (nếu cần)
    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Customer customer;
}

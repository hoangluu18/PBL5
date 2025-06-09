package com.pbl5.common.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "store_requests")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class StoreRequest extends IdBaseEntity{

    private String storeName;
    private String address;
    private String phoneNumber;
    private String description;
    private int status;
    private Date requestDate;
    private Date responseDate;
    private String responseNote;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    @JsonIgnore
    private Customer customer;
}

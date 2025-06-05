package com.pbl5.admin.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShopRevenueDto {
    private String shopName;
    private Double revenue;
}

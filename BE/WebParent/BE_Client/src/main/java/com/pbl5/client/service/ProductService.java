package com.pbl5.client.service;

import com.pbl5.common.entity.product.Product;
import org.springframework.data.domain.Page;

public interface ProductService {
    Page<Product> listAll(int page);
}

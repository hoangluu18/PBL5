package com.pbl5.client.service;

import com.pbl5.client.dto.product.ProductDto;
import com.pbl5.client.exception.ProductNotFoundException;
import com.pbl5.common.entity.product.Product;
import org.springframework.data.domain.Page;

public interface ProductService {
    Page<Product> listAll(int page);

    Product getByAlias(String alias) throws ProductNotFoundException;

    Product get(Integer id) throws ProductNotFoundException;

    Page<Product> listAllByShopId(int page, int shopId);
}

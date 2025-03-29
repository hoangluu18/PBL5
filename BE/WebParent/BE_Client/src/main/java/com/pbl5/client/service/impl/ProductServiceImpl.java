package com.pbl5.client.service.impl;

import com.pbl5.client.common.Constants;
import com.pbl5.client.repository.ProductRepository;
import com.pbl5.client.service.ProductService;
import com.pbl5.common.entity.product.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired private ProductRepository productRepository;

    @Override
    public Page<Product> listAll(int page) {
        return productRepository.findAll(PageRequest.of(page, Constants.PRODUCTS_PER_PAGE));
    }
}

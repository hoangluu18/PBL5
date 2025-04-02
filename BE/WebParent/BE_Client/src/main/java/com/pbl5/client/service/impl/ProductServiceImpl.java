package com.pbl5.client.service.impl;

import com.pbl5.client.bean.SearchParam;
import com.pbl5.client.common.Constants;
import com.pbl5.client.dto.product.ProductDto;
import com.pbl5.client.exception.ProductNotFoundException;
import com.pbl5.client.repository.ProductRepository;
import com.pbl5.client.service.ProductService;
import com.pbl5.common.entity.product.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired private ProductRepository productRepository;

    @Override
    public Page<Product> listAll(int page) {
        return productRepository.findAll(PageRequest.of(page, Constants.PRODUCTS_PER_PAGE));
    }

    @Override
    public Product getByAlias(String alias) throws ProductNotFoundException {
        Product product = productRepository.findByAlias(alias);
        if(product == null){
            throw new ProductNotFoundException("Could not find any product with alias " + alias);
        }
        return product;
    }

    @Override
    public Product get(Integer id) throws ProductNotFoundException {
        Product product = productRepository.findById(id).get();
        if(product == null){
            throw new ProductNotFoundException("Could not find any product with id " + id);
        }
        return product;
    }

    @Override
    public Page<Product> listAllByShopId(int page, int shopId) {
        return productRepository.findAllByShopId(shopId, PageRequest.of(page, Constants.PRODUCTS_PER_PAGE));
    }

    @Override
    public Page<ProductDto> searchProducts(int page, SearchParam searchParam) {
        Sort sort = Sort.by("createdAt").descending();

        if("newest".equals(searchParam.getSortOption())){
            sort = Sort.by("createdAt").descending();
        } else if ("price_asc".equals(searchParam.getSortOption())) {
            sort = Sort.by("price").ascending();
        }else if ("price_desc".equals(searchParam.getSortOption())) {
            sort = Sort.by("price").descending();
        }else if ("rating_asc".equals(searchParam.getSortOption())) {
            sort = Sort.by("averageRating").ascending();
        }else if ("rating_desc".equals(searchParam.getSortOption())) {
            sort = Sort.by("averageRating").descending();
        }

        Pageable pageable = PageRequest.of(page, Constants.PRODUCTS_PER_PAGE, sort);
        Page<Product> products = productRepository.searchProducts(searchParam, pageable);
        return products.map(product -> {
            ProductDto productDto = new ProductDto();
            productDto.clone(product);

            return productDto;
        });
    }
}

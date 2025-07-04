package com.pbl5.client.service;

import com.pbl5.client.bean.SearchParam;
import com.pbl5.client.dto.product.ProductDto;
import com.pbl5.client.exception.ProductNotFoundException;
import com.pbl5.common.entity.product.Product;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {
    Page<Product> listAll(int page);

    Product getByAlias(String alias) throws ProductNotFoundException;

    Product get(Integer id) throws ProductNotFoundException;

    Page<Product> listAllByShopId(int page, int shopId);
    Product getByProductId(int productId) throws ProductNotFoundException;

    Page<ProductDto> searchProducts(int page, SearchParam searchParam);

    void updateReviewCount(Integer productId);

    List<ProductDto> getTopRatedProducts();
}

package com.pbl5.admin.service.shop;

import com.pbl5.admin.dto.shop.ProductDetailDto;
import com.pbl5.admin.dto.shop.ProductDto;
import com.pbl5.common.entity.product.Product;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface ProductService {
    Page<ProductDto> getAllProducts(int page, int size, String sortField, String sortDir);
    ProductDto getProductById(Long id);
    ProductDto createProduct(ProductDto productDto);
    ProductDto updateProduct(Long id, ProductDto productDto);
    void deleteProduct(Long id);
    ProductDetailDto updateProductDetail(Long id, ProductDetailDto productDetailDto);
    // Các phương thức tìm kiếm và lọc
    Page<ProductDto> searchProducts(String keyword, int page, int size,Long shopId);
    Page<ProductDto> filterByPrice(float minPrice, float maxPrice, int page, int size,Long shopId);
    Page<ProductDto> filterByStock(int threshold, int page, int size,Long shopId);

    ProductDetailDto getProductDetailById(Long id);

    // Thêm parameter shopId vào phương thức
    Page<ProductDto> getAllProducts(int page, int size, String sortField, String sortDir, Long shopId);

    Optional<Product> findById(Long id);

    Product save(Product product);

    // In ProductService.java interface
    ProductDto setProductEnabled(Long id, boolean enabled);

    ProductDetailDto createProductWithDetails(ProductDetailDto productDetailDto);
}
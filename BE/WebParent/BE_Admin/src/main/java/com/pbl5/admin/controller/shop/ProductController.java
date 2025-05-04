package com.pbl5.admin.controller.shop;

import com.pbl5.admin.dto.shop.ProductDetailDto;
import com.pbl5.admin.dto.shop.ProductDto;
import com.pbl5.admin.service.shop.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "asc") String dir,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Float minPrice,
            @RequestParam(required = false) Float maxPrice,
            @RequestParam(required = false) Integer stockThreshold,
            @RequestParam(required = false) Long shopId) { // Thêm tham số shopId

        Page<ProductDto> productPage;

        if (keyword != null && !keyword.isEmpty()) {
            productPage = productService.searchProducts(keyword, page, size,shopId);
        } else if (minPrice != null && maxPrice != null) {
            productPage = productService.filterByPrice(minPrice, maxPrice, page, size,shopId);
        } else if (stockThreshold != null) {
            productPage = productService.filterByStock(stockThreshold, page, size,shopId);
        } else {
            productPage = productService.getAllProducts(page, size, sort, dir, shopId); // Truyền shopId
        }

        Map<String, Object> response = new HashMap<>();
        response.put("products", productPage.getContent());
        response.put("currentPage", productPage.getNumber());
        response.put("totalItems", productPage.getTotalElements());
        response.put("totalPages", productPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody ProductDto productDto) {
        return new ResponseEntity<>(productService.createProduct(productDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDto productDto) {
        return ResponseEntity.ok(productService.updateProduct(id, productDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<ProductDetailDto> getProductDetail(@PathVariable Long id) {
        ProductDetailDto productDetail = productService.getProductDetailById(id);
        return ResponseEntity.ok(productDetail);
    }

    @PutMapping("/{id}/detail")
    public ResponseEntity<ProductDetailDto> updateProductDetail(@PathVariable Long id,
                                                                @RequestBody ProductDetailDto productDetailDto) {
        ProductDetailDto updatedProductDetail = productService.updateProductDetail(id, productDetailDto);
        return ResponseEntity.ok(updatedProductDetail);
    }

    @PatchMapping("/{id}/set-enabled")
    public ResponseEntity<ProductDto> setProductEnabled(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> payload
    ) {
        Boolean enabled = payload.get("enabled");
        if (enabled == null) {
            return ResponseEntity.badRequest().build();
        }

        ProductDto updatedProduct = productService.setProductEnabled(id, enabled);
        return ResponseEntity.ok(updatedProduct);
    }

    @PostMapping("/create-with-details")
    public ResponseEntity<ProductDetailDto> createProductWithDetails(@RequestBody ProductDetailDto productDetailDto) {
        try {
            ProductDetailDto createdProduct = productService.createProductWithDetails(productDetailDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



}

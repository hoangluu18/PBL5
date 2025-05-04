package com.pbl5.admin.controller.shop;

import com.pbl5.admin.dto.shop.ProductVariantDto;
import com.pbl5.admin.dto.shop.ProductVariantGroupDto;
import com.pbl5.admin.repository.shop.ProductVariantRepository;
import com.pbl5.admin.service.shop.ProductService;
import com.pbl5.common.entity.product.Product;
import com.pbl5.common.entity.product.ProductVariant;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products/{productId}/variants")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProductVariantController {

    private final ProductService productService;
    private final ProductVariantRepository variantRepository;

    @GetMapping
    public ResponseEntity<List<ProductVariantDto>> getAllVariants(@PathVariable Long productId) {
        try {
            List<ProductVariant> variants = variantRepository.findByProductId(productId);
            List<ProductVariantDto> variantDtos = variants.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(variantDtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/groups")
    public ResponseEntity<List<ProductVariantGroupDto>> getVariantGroups(@PathVariable Long productId) {
        try {
            Product product = productService.findById(productId)
                    .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));

            // Nhóm các variants theo key
            Map<String, List<ProductVariant>> variantMap = product.getVariants().stream()
                    .collect(Collectors.groupingBy(ProductVariant::getKey));

            List<ProductVariantGroupDto> groups = variantMap.entrySet().stream()
                    .map(entry -> {
                        ProductVariantGroupDto group = new ProductVariantGroupDto();
                        group.setName(entry.getKey());
                        group.setVariants(entry.getValue().stream()
                                .map(this::convertToDto)
                                .collect(Collectors.toList()));
                        return group;
                    }).collect(Collectors.toList());

            return ResponseEntity.ok(groups);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/update-quantity")
    public ResponseEntity<Map<String, Object>> updateVariantQuantity(
            @PathVariable Long productId,
            @RequestBody List<ProductVariantDto> variantDtos) {

        try {
            Product product = productService.findById(productId)
                    .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));

            Map<Integer, ProductVariant> variantMap = product.getVariants().stream()
                    .collect(Collectors.toMap(ProductVariant::getId, v -> v));

            for (ProductVariantDto dto : variantDtos) {
                if (variantMap.containsKey(dto.getId())) {
                    ProductVariant variant = variantMap.get(dto.getId());
                    variant.setQuantity(dto.getQuantity());
                }
            }

            productService.save(product);

            // Cập nhật số lượng tổng và trả về
            Integer totalQuantity = variantRepository.sumQuantityByProductId(productId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalQuantity", totalQuantity != null ? totalQuantity : 0);

            return ResponseEntity.ok(response);

        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private ProductVariantDto convertToDto(ProductVariant variant) {
        ProductVariantDto dto = new ProductVariantDto();
        dto.setId(Long.valueOf(variant.getId()));
        dto.setKey(variant.getKey());
        dto.setValue(variant.getValue());
        dto.setQuantity(variant.getQuantity());
        dto.setPhoto(variant.getPhoto());
        dto.setParentId(Long.valueOf(variant.getParentId()));
        return dto;
    }
}

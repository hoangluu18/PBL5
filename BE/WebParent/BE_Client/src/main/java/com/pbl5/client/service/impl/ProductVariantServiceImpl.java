package com.pbl5.client.service.impl;

import com.pbl5.client.exception.ProductNotFoundException;
import com.pbl5.client.repository.ProductVariantRepository;
import com.pbl5.client.service.ProductVariantService;
import com.pbl5.common.entity.product.ProductVariant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ProductVariantServiceImpl implements ProductVariantService {
    @Autowired
    ProductVariantRepository productVariantRepository;
    @Override
    public void reduceQuantity(int productId, int quantity, String attributes) throws RuntimeException {
        //split attributes
        String[] attributeArray = attributes.split(",");
        List<ProductVariant> productVariantList = productVariantRepository.findProductVariantsByProductId(productId);
        if(productVariantList == null || productVariantList.isEmpty()) {
            throw new RuntimeException("Product variant not found");
        }
        // Check if the product has only one variant
        if(productVariantList.size() == 1){
            ProductVariant productVariant = productVariantList.get(0);
            if(productVariant.getQuantity() <= quantity){
                throw new RuntimeException("Not enough quantity");
            }
            productVariant.setQuantity(productVariant.getQuantity() - quantity);
            productVariantRepository.save(productVariant);
        }
        // If the product has multiple variants, reduce the quantity of each variant
        else {
            for(ProductVariant productVariant : productVariantList) {
                if(productVariant.getQuantity() <= quantity){
                    throw new RuntimeException("Not enough quantity");
                }
                productVariant.setQuantity(productVariant.getQuantity() - quantity);
                productVariantRepository.save(productVariant);
            }

        }
    }

    @Override
    public void reduceVariantQuantityForSingleAttribute(int productId, int quantity, String attributeStr) {
        try {
            // 1. Phân tích chuỗi thuộc tính
            String[] parts = attributeStr.split(":");
            if (parts.length != 2) {
                throw new IllegalArgumentException("Invalid attribute format: " + attributeStr);
            }

            String key = parts[0].trim();
            String value = parts[1].trim();

            // 2. Tìm variant phù hợp
            Optional<ProductVariant> variantOpt = productVariantRepository.findByProductIdAndKeyAndValue(
                    productId, key, value);

            if (variantOpt.isEmpty()) {
                throw new ProductNotFoundException("Không tìm thấy biến thể sản phẩm với " + attributeStr);
            }

            // 3. Trừ số lượng
            ProductVariant variant = variantOpt.get();
            if (variant.getQuantity() < quantity) {
                throw new IllegalArgumentException("Số lượng không đủ cho biến thể sản phẩm với " + attributeStr);
            }

            variant.setQuantity(variant.getQuantity() - quantity);
            productVariantRepository.save(variant);


        } catch (Exception e) {
            // Xử lý lỗi nếu cần thiết
            throw new RuntimeException("Lỗi khi giảm số lượng biến thể sản phẩm: " + e.getMessage());
        }
    }

    @Override
    public void reduceVariantQuantityForMultipleAttributes(int productId, int quantity, String attributeStr) {
        try {
            // 1. Phân tích chuỗi thuộc tính thành map
            Map<String, String> attributeMap = parseAttributeString(attributeStr);
            if (attributeMap.isEmpty()) {
                throw new IllegalArgumentException("No valid attributes found in: " + attributeStr);
            }

            // 2. Tìm variant cha (thường là màu sắc)
            String colorKey = "Màu sắc";
            if (!attributeMap.containsKey(colorKey)) {
                // Xử lý trường hợp không có màu sắc trong attributes
                reduceVariantQuantityForSingleAttribute(productId, quantity, attributeStr);
                return;
            }

            String colorValue = attributeMap.get(colorKey);
            Optional<ProductVariant> parentVariantOpt = productVariantRepository.findByProductIdAndKeyAndValueAndParentIdIsNull(
                    productId, colorKey, colorValue);

            if (parentVariantOpt.isEmpty()) {
                throw new ProductNotFoundException("Không tìm thấy biến thể màu sắc: " + colorValue);
            }

            ProductVariant parentVariant = parentVariantOpt.get();

            // 3. Tìm variant con (thường là kích cỡ)
            String sizeKey = "Kích cỡ";
            if (!attributeMap.containsKey(sizeKey)) {
                // Nếu chỉ có màu sắc, trừ số lượng variant màu sắc
                if (parentVariant.getQuantity() < quantity) {
                    throw new IllegalArgumentException("Số lượng không đủ cho biến thể màu sắc: " + colorValue);
                }

                parentVariant.setQuantity(parentVariant.getQuantity() - quantity);
                productVariantRepository.save(parentVariant);
                return;
            }

            String sizeValue = attributeMap.get(sizeKey);
            Optional<ProductVariant> childVariantOpt = productVariantRepository.findByProductIdAndKeyAndValueAndParentId(
                    productId, sizeKey, sizeValue, (Long.valueOf(parentVariant.getId())));

            if (childVariantOpt.isEmpty()) {
                throw new ProductNotFoundException("Không tìm thấy biến thể kích cỡ: " + sizeValue);
            }

            ProductVariant childVariant = childVariantOpt.get();

            // 4. Trừ số lượng ở cả variant cha và con
            if (childVariant.getQuantity() < quantity) {
                throw new IllegalArgumentException("Số lượng không đủ cho biến thể kích cỡ: " + sizeValue);
            }

            childVariant.setQuantity(childVariant.getQuantity() - quantity);
            productVariantRepository.save(childVariant);

            // Cập nhật lại số lượng variant cha
            parentVariant.setQuantity(
                    productVariantRepository.sumQuantityByParentId(Long.valueOf(parentVariant.getId()))
            );
            productVariantRepository.save(parentVariant);


        } catch (Exception e) {
            // Xử lý lỗi nếu cần thiết
            throw new RuntimeException("Lỗi khi giảm số lượng biến thể sản phẩm: " + e.getMessage());
        }
    }



    private Map<String, String> parseAttributeString(String attributeStr) {
        Map<String, String> result = new HashMap<>();

        String[] attributes = attributeStr.split(",");
        for (String attr : attributes) {
            String[] parts = attr.split(":");
            if (parts.length == 2) {
                String key = parts[0].trim();
                String value = parts[1].trim();
                result.put(key, value);
            }
        }

        return result;
    }
}

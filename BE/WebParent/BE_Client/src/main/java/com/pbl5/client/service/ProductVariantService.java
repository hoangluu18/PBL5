package com.pbl5.client.service;

public interface ProductVariantService {
    void reduceQuantity(int productId, int quantity, String attributes) throws RuntimeException;

    void reduceVariantQuantityForSingleAttribute(int productId, int quantity, String attributeStr);
    void reduceVariantQuantityForMultipleAttributes(int productId, int quantity, String attributeStr);
}

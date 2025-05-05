package com.pbl5.admin.repository.shop;

import com.pbl5.common.entity.product.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    List<ProductVariant> findByProductId(Long productId);

    void deleteByProductId(Long productId);

    @Query("SELECT v FROM ProductVariant v WHERE v.product.id = :productId AND v.parentId IS NULL")
    List<ProductVariant> findParentVariantsByProductId(@Param("productId") Long productId);

    @Query("SELECT v FROM ProductVariant v WHERE v.product.id = :productId AND v.parentId = :parentId")
    List<ProductVariant> findChildVariantsByProductIdAndParentId(
            @Param("productId") Long productId,
            @Param("parentId") Long parentId);

    @Query("SELECT COALESCE(SUM(v.quantity), 0) FROM ProductVariant v " +
            "WHERE v.product.id = :productId " +
            "AND ((EXISTS (SELECT 1 FROM ProductVariant v2 WHERE v2.product.id = :productId AND v2.parentId IS NOT NULL) " +
            "      AND v.parentId IS NOT NULL) " +
            "    OR " +
            "     (NOT EXISTS (SELECT 1 FROM ProductVariant v2 WHERE v2.product.id = :productId AND v2.parentId IS NOT NULL) " +
            "      AND v.parentId IS NULL))")
    Integer sumQuantityByProductId(@Param("productId") Long productId);
}

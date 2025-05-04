package com.pbl5.admin.repository.shop;

import com.pbl5.common.entity.product.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Tìm kiếm theo tên
    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword%")
    Page<Product> findByNameContaining(@Param("keyword") String keyword, Pageable pageable);

    // Tìm kiếm theo code
    @Query("SELECT p FROM Product p WHERE CAST(p.id AS string) LIKE %:code%")
    Page<Product> findByCodeContaining(@Param("code") String code, Pageable pageable);

    // Lọc theo khoảng giá
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    Page<Product> findByPriceBetween(@Param("minPrice") float minPrice, @Param("maxPrice") float maxPrice, Pageable pageable);

    // Tính tổng số lượng từ các variants của sản phẩm
    @Query("SELECT SUM(pv.quantity) FROM ProductVariant pv WHERE pv.product.id = :productId")
    Integer sumTotalQuantityByProductId(@Param("productId") Long productId);

    // Lọc sản phẩm theo tồn kho (dựa trên variant)
    @Query("SELECT p FROM Product p WHERE p.id IN " +
            "(SELECT pv.product.id FROM ProductVariant pv GROUP BY pv.product.id HAVING SUM(pv.quantity) <= :threshold)")
    Page<Product> findByTotalVariantQuantityLessThanEqual(@Param("threshold") int threshold, Pageable pageable);


    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.productDetails " +
            "LEFT JOIN FETCH p.variants " +
            "LEFT JOIN FETCH p.images WHERE p.id = :id")
    Optional<Product> findByIdWithDetails(@Param("id") Long id);

    // Thêm phương thức tìm kiếm theo shopId
    @Query("SELECT p FROM Product p WHERE p.shop.id = :shopId")
    Page<Product> findByShopId(@Param("shopId") Long shopId, Pageable pageable);

    Page<Product> findByPriceBetweenAndShopId(float minPrice, float maxPrice, Long shopId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.id IN " +
            "(SELECT pv.product.id FROM ProductVariant pv GROUP BY pv.product.id HAVING SUM(pv.quantity) <= :threshold) " +
            "AND p.shop.id = :shopId")
    Page<Product> findByTotalVariantQuantityLessThanEqualAndShopId(@Param("threshold") int threshold, @Param("shopId") Long shopId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% AND p.shop.id = :shopId")
    Page<Product> findByNameContainingAndShopId(@Param("keyword") String keyword, @Param("shopId") Long shopId, Pageable pageable);
}
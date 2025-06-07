package com.pbl5.client.repository;

import com.pbl5.client.bean.SearchParam;
import com.pbl5.common.entity.product.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("SELECT p FROM Product p WHERE p.enabled = true")
    public Page<Product> findAll(Pageable pageable);

    public Product findByAlias(String alias);

    public Page<Product> findAllByShopId(int shopId, Pageable pageable);

    public Product findById(int productId);

    @Query("SELECT p FROM Product p WHERE p.enabled = true " +
            "AND (:#{#param.categoryId == null} = true OR p.category.id = :#{#param.categoryId}) " +
            "AND (:#{#param.brandIds == null || #param.brandIds.isEmpty()} = true OR p.brand.id IN :#{#param.brandIds}) " +
            "AND p.price BETWEEN :#{#param.minPrice} AND :#{#param.maxPrice} " +
            "AND p.averageRating >= :#{#param.rating} " +
            "AND (:#{#param.keyword == null} = true OR LOWER(p.name) " +
            "LIKE LOWER(CONCAT('%', :#{#param.keyword}, '%'))) ")
    public Page<Product> searchProducts(@Param("param") SearchParam param, Pageable pageable);

    @Modifying
    @Query("UPDATE Product p SET p.reviewCount = (SELECT COUNT(r) FROM Review r WHERE r.product.id = ?1) " +
            "WHERE p.id = ?1")
    void updateReviewCount(Integer productId);

    @Query("SELECT p FROM Product p WHERE p.enabled = true ORDER BY p.reviewCount DESC, p.averageRating DESC LIMIT 30")
    List<Product> getTopRatedProducts();
}

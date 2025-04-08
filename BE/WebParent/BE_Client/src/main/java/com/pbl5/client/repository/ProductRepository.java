package com.pbl5.client.repository;

import com.pbl5.client.bean.SearchParam;
import com.pbl5.common.entity.product.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
}

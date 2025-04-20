package com.pbl5.client.repository;

import com.pbl5.common.entity.product.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {

    @Query("update ProductVariant pv set pv.quantity = pv.quantity - ?2 where pv.id = ?1 and pv.quantity >= ?2")
    boolean reduceQuantity(int productVariantId, int quantity);

    List<ProductVariant>  findProductVariantsByProductId(int productId);
    @Query("select pv from ProductVariant pv where pv.product.id = ?1 and pv.parentId is null")
    ProductVariant findParentVariantById(int productId);


    @Query("SELECT pv FROM ProductVariant pv WHERE pv.product.id = :productId AND pv.key = :keyName AND pv.value = :value")
    Optional<ProductVariant> findByProductIdAndKeyAndValue(@Param("productId") Integer productId, @Param("keyName") String key, @Param("value") String value);

    Optional<ProductVariant> findByProductIdAndKeyAndValueAndParentIdIsNull(
            Integer productId, String key, String value);

    Optional<ProductVariant> findByProductIdAndKeyAndValueAndParentId(
            Integer productId, String key, String value, Long parentId);

    @Query("SELECT SUM(v.quantity) FROM ProductVariant v WHERE v.parentId = :parentId")
    Integer sumQuantityByParentId(Long parentId);
}

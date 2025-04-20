package com.pbl5.client.repository;

import com.pbl5.common.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    @Query("SELECT c FROM Category c WHERE c.enabled = true AND c.parent is NULL ORDER BY c.name")
    public List<Category> findRootCategories();

    public Category findByAlias(String alias);

    @Query("SELECT c.alias FROM Category c JOIN Product p" +
            " ON p.category.id = c.id" +
            " WHERE c.enabled = true AND p.name LIKE %?1% OR p.alias LIKE %?1%")
    public String findAliasByKeyword(String keyword);
}

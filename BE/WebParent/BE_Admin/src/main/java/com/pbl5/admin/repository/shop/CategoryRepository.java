package com.pbl5.admin.repository.shop;

import com.pbl5.common.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    // Các phương thức truy vấn đặc biệt (nếu cần)
}
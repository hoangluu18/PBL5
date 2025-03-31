package com.pbl5.client.category;

import com.pbl5.client.repository.CategoryRepository;
import com.pbl5.common.entity.Category;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import java.util.List;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
public class CategoryRepositoryTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    public void testGetRootCategories() {
        categoryRepository.findRootCategories().forEach(category -> {
            System.out.println(category.getName());
        });
    }



    @Test
    public void testGetById() {
        Integer id = 3;
        Category category = categoryRepository.findById(id).get();
        System.out.println(category.getName());
    }

}

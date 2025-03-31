package com.pbl5.client.category;

import com.pbl5.client.repository.CategoryRepository;
import com.pbl5.client.service.CategoryService;
import com.pbl5.client.service.impl.CategoryServiceImpl;
import com.pbl5.common.entity.Category;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
public class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks private CategoryServiceImpl categoryService;

    @Test
    public void testGetParents(){
        // Mock dữ liệu từ DB
        Category categoryFromDb = new Category();
        categoryFromDb.setId(4);
        categoryFromDb.setName("Men's Fashion");

        Mockito.when(categoryRepository.findById(4)).thenReturn(Optional.of(categoryFromDb));

        // Lấy category từ repository (giả lập behavior như DB)
        Category category = categoryRepository.findById(4).orElseThrow();

        // Gọi phương thức cần test
        List<Category> parents = categoryService.getParents(category);

        // Kiểm tra kết quả
        System.out.println("Category Name: " + category.getName());  // Debugging
        System.out.println("Number of Parents: " + parents.size());
    }
}

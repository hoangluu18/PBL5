package com.pbl5.client.service.impl;

import com.pbl5.client.repository.CategoryRepository;
import com.pbl5.client.service.CategoryService;
import com.pbl5.common.entity.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired private CategoryRepository categoryRepository;

    @Override
    public List<Category> listAllRootCategories() {
        return categoryRepository.findRootCategories();
    }
}

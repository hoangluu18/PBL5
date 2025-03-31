package com.pbl5.client.service.impl;

import com.pbl5.client.exception.CategoryNotFoundException;
import com.pbl5.client.repository.CategoryRepository;
import com.pbl5.client.service.CategoryService;
import com.pbl5.common.entity.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired private CategoryRepository categoryRepository;

    @Override
    public List<Category> listAllRootCategories() {
        return categoryRepository.findRootCategories();
    }

    @Override
    public List<Category> getParents(Category category){
        List<Category> parents = new ArrayList<>();
        parents.add(0, category);
        Category parent = category.getParent();
        while(parent != null){
            parents.add(0, parent);
            parent = parent.getParent();
        }

        return parents;
    }

    @Override
    public Category getCategory(String alias) throws CategoryNotFoundException {
        Category category = categoryRepository.findByAlias(alias);
        if(category == null){
            throw new CategoryNotFoundException("Could not find any category with alias " + alias);
        }
        return category;
    }
}

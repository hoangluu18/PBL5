package com.pbl5.client.controller;

import com.pbl5.client.bean.SearchParam;
import com.pbl5.client.common.Constants;
import com.pbl5.client.dto.category.CategoryDto;
import com.pbl5.client.dto.category.RootCategoryDto;
import com.pbl5.client.dto.product.ProductDto;
import com.pbl5.client.exception.CategoryNotFoundException;
import com.pbl5.client.service.CategoryService;
import com.pbl5.client.service.ProductService;
import com.pbl5.common.entity.Category;
import com.pbl5.common.entity.product.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping(Constants.CATEGORY_API_URI)
@CrossOrigin(origins = Constants.FE_URL)
public class CategoryController {

    @Autowired private CategoryService categoryService;

    @Autowired private ProductService productService;

    @GetMapping
    public ResponseEntity<List<RootCategoryDto>> listRootCategories() {
        List<RootCategoryDto> rootCategoryDtos = new ArrayList<>();
        List<Category> rootCategories = categoryService.listAllRootCategories();

        rootCategories.forEach(c -> {
            RootCategoryDto dto = new RootCategoryDto(c.getId(), c.getName(), c.getAlias(), c.getImage());
            rootCategoryDtos.add(dto);
        });

        return ResponseEntity.ok(rootCategoryDtos);
    }

    @GetMapping("/{alias}")
    public ResponseEntity<?> search(@PathVariable("alias") String alias,
                                    @RequestParam(value = "page", defaultValue = "1") int page,
                                    @ModelAttribute SearchParam searchParam) throws CategoryNotFoundException {

        try {
            Category category = categoryService.getCategory(alias);
            searchParam.setCategoryId(category.getId());

            if(page < 1){
                page = 1;
            }

            Map<String, Object> response = new HashMap<>();
            response.put("categories",  categoryService.getChildren(category));
            response.put("brands",  categoryService.getBrands(category));

            Page<ProductDto> pageProduct = productService.searchProducts(page - 1, searchParam);

            response.put("products", pageProduct.getContent());
            response.put("totalPages", pageProduct.getTotalPages());
            response.put("totalElements", pageProduct.getTotalElements());
            response.put("currentPage", page);
            response.put("categoryId", category.getId());

            return ResponseEntity.ok(response);

        } catch (CategoryNotFoundException e) {
            throw new CategoryNotFoundException("Could not find any category with alias " + alias);
        }
    }

    @GetMapping("/{alias}/breadcrumbs")
    public ResponseEntity<?> getBreadCrumbs(@PathVariable("alias") String alias) {
        List<CategoryDto> categoryDtos = new ArrayList<>();

        try {
            Category category = categoryService.getCategory(alias);
            List<Category> parents = categoryService.getParents(category);

            if(!parents.isEmpty()){
                parents.forEach(p -> {
                    categoryDtos.add(new CategoryDto(p.getId(),p.getName(), p.getAlias()));
                });
            }
            return ResponseEntity.ok(categoryDtos);

        } catch (CategoryNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

}

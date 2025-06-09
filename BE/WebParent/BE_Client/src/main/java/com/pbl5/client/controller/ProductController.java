package com.pbl5.client.controller;

import com.pbl5.client.bean.SearchParam;
import com.pbl5.client.common.Constants;
import com.pbl5.client.dto.ShopDto;
import com.pbl5.client.dto.category.CategoryDto;
import com.pbl5.client.dto.product.ProductDetailDto;
import com.pbl5.client.dto.product.ProductDto;
import com.pbl5.client.dto.product.ProductFullInfoDto;
import com.pbl5.client.dto.product.ProductVariantDto;
import com.pbl5.client.exception.CategoryNotFoundException;
import com.pbl5.client.service.CategoryService;
import com.pbl5.client.service.ProductService;
import com.pbl5.common.entity.Category;
import com.pbl5.common.entity.Shop;
import com.pbl5.common.entity.product.Product;
import com.pbl5.common.entity.product.ProductVariant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping(Constants.PRODUCT_API_URI)
@CrossOrigin(origins = Constants.FE_URL)
public class ProductController {

    @Autowired private ProductService productService;

    @Autowired private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<ProductDto>> listProduct(
            @RequestParam(name = "pageNum", defaultValue = "1") int pageNum) {

        List<ProductDto> productDtos = new ArrayList<>();
        if(pageNum < 1) {
            pageNum = 1;
        }


        productService.listAll(pageNum - 1).getContent().forEach(p -> {
            ProductDto dto = new ProductDto();
            dto.setId(p.getId());
            dto.setName(p.getName());
            dto.setAlias(p.getAlias());
            dto.setMainImage(p.getMainImage());
            dto.setPrice(p.getPrice());
            dto.setDiscountPercent(p.getDiscountPercent());
            dto.setReviewCount(p.getReviewCount());
            dto.setAverageRating(p.getAverageRating());
            productDtos.add(dto);
        });

        return ResponseEntity.ok(productDtos);
    }

    @GetMapping("/{alias}")
    public ResponseEntity<?> viewProduct(@PathVariable("alias") String alias) {
        try {
            Product product = productService.getByAlias(alias);

            ProductFullInfoDto productFullInfoDto = new ProductFullInfoDto();

            productFullInfoDto.cloneProduct(product);

            setBreadCrumbs(product, productFullInfoDto);

            setImages(product, productFullInfoDto);

            setVariants(product, productFullInfoDto);

            setShop(product, productFullInfoDto);


            return ResponseEntity.ok(productFullInfoDto);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProduct(@ModelAttribute SearchParam searchParam,
                                           @RequestParam(value = "page", required = false, defaultValue = "1") int page) throws CategoryNotFoundException {
        Page<ProductDto> productDtos = productService.searchProducts(0, searchParam);

        if(page < 1) {
            page = 1;
        }



        Map<String, Object> map = new HashMap<>();
        //map.put("categories",  categoryService.listAllRootCategories());
        //map.put("brands",  categoryService.getBrands(new Category(1)));

        map.put("totalPages", productDtos.getTotalPages());
        map.put("totalElements", productDtos.getTotalElements());
        map.put("currentPage", page);

        map.put("products", productDtos.getContent());

        return ResponseEntity.ok(map);
    }

    @GetMapping("/top-rated")
    public ResponseEntity<?> getTopRatedProducts() {

        return ResponseEntity.ok(productService.getTopRatedProducts());
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<?> getDetails(@PathVariable("id") Integer id) {
        try {
            Product product = productService.get(id);

            List<ProductDetailDto> detailDtosDtos = new ArrayList<>();
            product.getProductDetails().forEach(d -> {
                ProductDetailDto dto = new ProductDetailDto();
                dto.setName(d.getName());
                dto.setValue(d.getValue());
                detailDtosDtos.add(dto);
            });

            return ResponseEntity.ok(detailDtosDtos);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    private static void setImages(Product product, ProductFullInfoDto productFullInfoDto) {
        product.getImages().forEach(img -> {
            productFullInfoDto.addImage(img.getPhoto());
        });
    }

    private static void setVariants(Product product, ProductFullInfoDto productFullInfoDto) {
        Set<ProductVariant> variants = product.getVariants();
        Map<String, List<ProductVariantDto>> map = variants.stream()
                .map(p -> {
                    ProductVariantDto dto = new ProductVariantDto();
                    dto.setId(p.getId());
                    dto.setKey(p.getKey());
                    dto.setValue(p.getValue());
                    dto.setQuantity(p.getQuantity());
                    dto.setPhoto(p.getPhoto());
                    dto.setParentId(p.getParentId());
                    return dto;
                })
                .collect(Collectors.groupingBy(ProductVariantDto::getKey));

        productFullInfoDto.setVariantMap(map);
    }

    private static void setShop(Product product, ProductFullInfoDto productFullInfoDto) {
        Shop shop = product.getShop();
        ShopDto shopDto = new ShopDto();
        shopDto.cloneShop(shop);
        productFullInfoDto.setShopDto(shopDto);
    }

    private void setBreadCrumbs(Product product, ProductFullInfoDto productFullInfoDto) {
        Category category = product.getCategory();
        List<Category> parents = new ArrayList<>();

        parents = categoryService.getParents(category);

        List<CategoryDto> childCategoryDtos = new ArrayList<>();

            if(parents.size() > 0){
            parents.forEach(p -> {
                childCategoryDtos.add(new CategoryDto(p.getId(), p.getName(), p.getAlias()));
            });
        }

        productFullInfoDto.setBreadCrumbs(childCategoryDtos);
    }


}

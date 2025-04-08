package com.pbl5.client.product;

import com.pbl5.client.bean.SearchParam;
import com.pbl5.client.repository.ProductRepository;
import com.pbl5.common.entity.product.Product;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.repository.query.Param;
import org.springframework.test.annotation.Rollback;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(false)
public class ProductRepositoryTest {

    @Autowired
    private ProductRepository repo;

    @Test
    public void testGetProduct() {
        Product product = repo.findById(1);
        System.out.println(product.getShop().getName());
    }

    @Test
    public void testGetByAlias() {
        String alias = "nike-t-shirt";
        Product product = repo.findByAlias(alias);
        System.out.println(product.getName() + " -> detail size " + product.getProductDetails().size()
                + " -> shop " + product.getShop().getName() + " -> images " + product.getImages().size()
        + " -> variants " + product.getVariants().size() + " -> category " + product.getCategory().getName());
    }

    @Test
    public void search(){
        SearchParam param = new SearchParam();
        param.setCategoryId(1);
        //param.setBrandId(1);
        //param.setRating(3);
        //param.setMinPrice(0);
        //param.setMaxPrice(1000000);


        Page<Product> products = repo.searchProducts(param, PageRequest.of(0, 5));
        products.getContent().forEach(p -> System.out.println(p));

    }

}

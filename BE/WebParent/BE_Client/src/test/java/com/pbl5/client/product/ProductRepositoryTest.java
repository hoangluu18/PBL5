package com.pbl5.client.product;

import com.pbl5.client.repository.ProductRepository;
import com.pbl5.common.entity.product.Product;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.jdbc.DataJdbcTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(false)
public class ProductRepositoryTest {

    @Autowired
    private ProductRepository repo;

    @Test
    public void testGetProduct() {
        Product product = repo.findById(1).get();
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
}

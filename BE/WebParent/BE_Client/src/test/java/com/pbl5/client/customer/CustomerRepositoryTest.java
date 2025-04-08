package com.pbl5.client.customer;

import com.pbl5.client.repository.CustomerRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
public class CustomerRepositoryTest {

    @Autowired private CustomerRepository customerRepository;

    @Test
    public void testFindByEmail(){
        String email = "thanhadp2402@gmail.coma";
        var customer = customerRepository.findByEmail(email);
        System.out.println(customer == null ? "Khong tim thay" : customer.getEmail());
    }
}

package com.pbl5.client.repository;

import com.pbl5.common.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    @Query("SELECT c FROM Customer c WHERE c.email = ?1")
    public Customer findByEmail(String email);

    @Query("SELECT c FROM Customer c WHERE c.verificationCode = ?1")
    public Customer findByVerificationCode(String verificationCode);

    @Query("UPDATE Customer c SET c.enabled = true, c.verificationCode = null WHERE c.id = ?1")
    @Modifying
    public void enable(Integer id);

    public Customer findById(int id);

}

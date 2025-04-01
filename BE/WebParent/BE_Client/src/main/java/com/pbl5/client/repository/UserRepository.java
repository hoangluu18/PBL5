package com.pbl5.client.repository;

import com.pbl5.common.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findEmailById(Integer id);
}

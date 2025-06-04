package com.pbl5.admin.repository.payment;

import com.pbl5.common.entity.Transaction;
import com.pbl5.common.entity.Wallet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

    List<Transaction> findBySourceWallet(Wallet wallet);

    List<Transaction> findByTargetWallet(Wallet wallet);

    @Query("SELECT t FROM Transaction t WHERE t.sourceWallet = :wallet OR t.targetWallet = :wallet ORDER BY t.createdAt DESC")
    List<Transaction> findAllByWallet(@Param("wallet") Wallet wallet);

    @Query("SELECT t FROM Transaction t WHERE t.sourceWallet = :wallet OR t.targetWallet = :wallet ORDER BY t.createdAt DESC")
    Page<Transaction> findAllByWallet(@Param("wallet") Wallet wallet, Pageable pageable);

    List<Transaction> findByOrderId(Integer orderId);
}

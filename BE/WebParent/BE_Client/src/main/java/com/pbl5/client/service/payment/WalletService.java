package com.pbl5.client.service.payment;



import com.pbl5.client.exception.InsufficientBalanceException;
import com.pbl5.client.repository.payment.WalletRepository;
import com.pbl5.common.entity.Customer;
import com.pbl5.common.entity.User;
import com.pbl5.common.entity.Wallet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;

    /**
     * Lấy ví của khách hàng, tạo mới nếu chưa có
     */
    @Transactional
    public Wallet getOrCreateCustomerWallet(Integer customerId, Customer customer) {
        Optional<Wallet> walletOpt = walletRepository.findByCustomer(customer);

        if (walletOpt.isPresent()) {
            return walletOpt.get();
        } else {
            Wallet wallet = new Wallet();
            wallet.setCustomer(customer);
            wallet.setBalance(BigDecimal.ZERO);
            wallet.setStatus("ACTIVE");
            return walletRepository.save(wallet);
        }
    }

    /**
     * Lấy ví của shop hoặc admin, tạo mới nếu chưa có
     */
    @Transactional
    public Wallet getOrCreateUserWallet(Integer userId, User user) {
        Optional<Wallet> walletOpt = walletRepository.findByUser(user);

        if (walletOpt.isPresent()) {
            return walletOpt.get();
        } else {
            Wallet wallet = new Wallet();
            wallet.setUser(user);
            wallet.setBalance(BigDecimal.ZERO);
            wallet.setStatus("ACTIVE");
            return walletRepository.save(wallet);
        }
    }

    /**
     * Nạp tiền vào ví
     */
    @Transactional
    public void depositToWallet(Wallet wallet, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số tiền phải lớn hơn 0");
        }

        if (!"ACTIVE".equals(wallet.getStatus())) {
            throw new IllegalStateException("Ví đang không hoạt động");
        }

        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);
    }

    /**
     * Trừ tiền từ ví
     */
    @Transactional
    public void deductFromWallet(Wallet wallet, BigDecimal amount) throws InsufficientBalanceException {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số tiền phải lớn hơn 0");
        }

        if (!"ACTIVE".equals(wallet.getStatus())) {
            throw new IllegalStateException("Ví đang không hoạt động");
        }

        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Số dư không đủ");
        }

        wallet.setBalance(wallet.getBalance().subtract(amount));
        walletRepository.save(wallet);
    }

    /**
     * Kiểm tra ví có đủ số dư không
     */
    public boolean hasEnoughBalance(Wallet wallet, BigDecimal amount) {
        return wallet.getBalance().compareTo(amount) >= 0;
    }

    /**
     * Cập nhật trạng thái ví
     */
    @Transactional
    public void updateWalletStatus(Wallet wallet, String status) {
        wallet.setStatus(status);
        walletRepository.save(wallet);
    }
}

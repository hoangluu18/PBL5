package com.pbl5.admin.service.payment;


import com.pbl5.admin.exception.InsufficientBalanceException;
import com.pbl5.admin.repository.payment.TransactionRepository;
import com.pbl5.admin.repository.payment.WalletRepository;
import com.pbl5.common.entity.Order;
import com.pbl5.common.entity.Transaction;
import com.pbl5.common.entity.Wallet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private WalletService walletService;

    /**
     * Tạo và lưu giao dịch nạp tiền
     */
    @Transactional
    public Transaction createDepositTransaction(Wallet targetWallet, BigDecimal amount) {
        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setType(Transaction.TransactionType.DEPOSIT);
        transaction.setStatus(Transaction.TransactionStatus.PENDING);
        transaction.setTargetWallet(targetWallet);
        transaction.setDescription("Nạp tiền vào ví");

        return transactionRepository.save(transaction);
    }

    /**
     * Hoàn thành giao dịch nạp tiền
     */
    @Transactional
    public Transaction completeDepositTransaction(Integer transactionId) {
        Optional<Transaction> transactionOpt = transactionRepository.findById(transactionId);

        if (!transactionOpt.isPresent()) {
            throw new IllegalArgumentException("Giao dịch không tồn tại");
        }

        Transaction transaction = transactionOpt.get();

        if (transaction.getType() != Transaction.TransactionType.DEPOSIT) {
            throw new IllegalArgumentException("Không phải giao dịch nạp tiền");
        }

        if (transaction.getStatus() != Transaction.TransactionStatus.PENDING) {
            throw new IllegalStateException("Giao dịch không ở trạng thái chờ xử lý");
        }

        Wallet targetWallet = transaction.getTargetWallet();
        Optional<Wallet> walletOpt = walletRepository.findByIdWithLock(targetWallet.getId());

        if (!walletOpt.isPresent()) {
            throw new IllegalStateException("Ví không tồn tại");
        }

        Wallet wallet = walletOpt.get();
        walletService.depositToWallet(wallet, transaction.getAmount());

        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        return transactionRepository.save(transaction);
    }

    /**
     * Tạo giao dịch thanh toán (từ ví khách hàng sang escrow)
     */
    @Transactional
    public Transaction createPaymentTransaction(Wallet sourceWallet, BigDecimal amount, Order order) throws InsufficientBalanceException {
        // Kiểm tra và khóa ví
        Optional<Wallet> walletOpt = walletRepository.findByIdWithLock(sourceWallet.getId());

        if (!walletOpt.isPresent()) {
            throw new IllegalStateException("Ví không tồn tại");
        }

        Wallet wallet = walletOpt.get();

        // Kiểm tra số dư
        if (!walletService.hasEnoughBalance(wallet, amount)) {
            throw new InsufficientBalanceException("Số dư không đủ");
        }

        // Tạo giao dịch
        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setType(Transaction.TransactionType.PAYMENT);
        transaction.setStatus(Transaction.TransactionStatus.PENDING);
        transaction.setSourceWallet(wallet);
        transaction.setOrder(order);
        transaction.setDescription("Thanh toán đơn hàng #" + order.getId());

        Transaction savedTransaction = transactionRepository.save(transaction);

        // Trừ tiền từ ví
        walletService.deductFromWallet(wallet, amount);

        // Cập nhật trạng thái giao dịch
        savedTransaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        return transactionRepository.save(savedTransaction);
    }

    /**
     * Lấy tất cả giao dịch của một ví
     */
    public List<Transaction> getTransactionsByWallet(Wallet wallet) {
        return transactionRepository.findAllByWallet(wallet);
    }

    /**
     * Lấy tất cả giao dịch của một ví (có phân trang)
     */
    public Page<Transaction> getTransactionsByWallet(Wallet wallet, Pageable pageable) {
        return transactionRepository.findAllByWallet(wallet, pageable);
    }

    /**
     * Tạo giao dịch hoàn tiền
     */
    @Transactional
    public Transaction createRefundTransaction(Wallet targetWallet, BigDecimal amount, Order order) {
        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setType(Transaction.TransactionType.REFUND);
        transaction.setStatus(Transaction.TransactionStatus.PENDING);
        transaction.setTargetWallet(targetWallet);
        transaction.setOrder(order);
        transaction.setDescription("Hoàn tiền đơn hàng #" + order.getId());

        return transactionRepository.save(transaction);
    }

    /**
     * Hoàn thành giao dịch hoàn tiền
     */
    @Transactional
    public Transaction completeRefundTransaction(Integer transactionId) {
        Optional<Transaction> transactionOpt = transactionRepository.findById(transactionId);

        if (!transactionOpt.isPresent()) {
            throw new IllegalArgumentException("Giao dịch không tồn tại");
        }

        Transaction transaction = transactionOpt.get();

        if (transaction.getType() != Transaction.TransactionType.REFUND) {
            throw new IllegalArgumentException("Không phải giao dịch hoàn tiền");
        }

        if (transaction.getStatus() != Transaction.TransactionStatus.PENDING) {
            throw new IllegalStateException("Giao dịch không ở trạng thái chờ xử lý");
        }

        Wallet targetWallet = transaction.getTargetWallet();
        Optional<Wallet> walletOpt = walletRepository.findByIdWithLock(targetWallet.getId());

        if (!walletOpt.isPresent()) {
            throw new IllegalStateException("Ví không tồn tại");
        }

        Wallet wallet = walletOpt.get();
        walletService.depositToWallet(wallet, transaction.getAmount());

        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        return transactionRepository.save(transaction);
    }
}

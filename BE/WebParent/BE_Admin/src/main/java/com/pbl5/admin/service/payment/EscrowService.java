package com.pbl5.admin.service.payment;


import com.pbl5.admin.exception.InsufficientBalanceException;
import com.pbl5.admin.repository.payment.EscrowRepository;
import com.pbl5.admin.repository.payment.WalletRepository;
import com.pbl5.common.entity.Escrow;
import com.pbl5.common.entity.Order;
import com.pbl5.common.entity.Transaction;
import com.pbl5.common.entity.Wallet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class EscrowService {

    @Autowired
    private EscrowRepository escrowRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private WalletService walletService;

    /**
     * Tạo escrow khi thanh toán đơn hàng
     */
    @Transactional
    public Escrow createEscrow(Order order, Wallet customerWallet, Wallet shopWallet, BigDecimal amount) throws InsufficientBalanceException {
        // Tạo giao dịch thanh toán từ ví khách hàng sang escrow
        Transaction transaction = transactionService.createPaymentTransaction(customerWallet, amount, order);

        // Tạo escrow
        Escrow escrow = new Escrow();
        escrow.setOrder(order);
        escrow.setAmount(amount);
        escrow.setStatus(Escrow.EscrowStatus.HOLDING);
        escrow.setCustomerWallet(customerWallet);
        escrow.setShopWallet(shopWallet);

        return escrowRepository.save(escrow);
    }

    /**
     * Giải phóng tiền từ escrow sang ví shop
     */
    @Transactional
    public void releaseEscrow(Integer escrowId) {
        Optional<Escrow> escrowOpt = escrowRepository.findByIdWithLock(escrowId);

        if (!escrowOpt.isPresent()) {
            throw new IllegalArgumentException("Escrow không tồn tại");
        }

        Escrow escrow = escrowOpt.get();

        if (escrow.getStatus() != Escrow.EscrowStatus.HOLDING) {
            throw new IllegalStateException("Escrow không ở trạng thái đang giữ tiền");
        }

        // Lấy ví shop
        Wallet shopWallet = escrow.getShopWallet();
        Optional<Wallet> walletOpt = walletRepository.findByIdWithLock(shopWallet.getId());

        if (!walletOpt.isPresent()) {
            throw new IllegalStateException("Ví shop không tồn tại");
        }

        Wallet wallet = walletOpt.get();

        // Chuyển tiền vào ví shop
        walletService.depositToWallet(wallet, escrow.getAmount());

        // Cập nhật trạng thái escrow
        escrow.setStatus(Escrow.EscrowStatus.RELEASED);
        escrow.setReleasedAt(new Date());
        escrowRepository.save(escrow);

        // Tạo giao dịch chuyển tiền
        Transaction transaction = new Transaction();
        transaction.setAmount(escrow.getAmount());
        transaction.setType(Transaction.TransactionType.ESCROW_RELEASE);
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        transaction.setTargetWallet(wallet);
        transaction.setOrder(escrow.getOrder());
        transaction.setDescription("Chuyển tiền từ escrow sang shop cho đơn hàng #" + escrow.getOrder().getId());

        transactionService.completeRefundTransaction(transaction.getId());
    }

    /**
     * Hoàn tiền từ escrow về ví khách hàng
     */
    @Transactional
    public void refundEscrow(Integer escrowId) {
        Optional<Escrow> escrowOpt = escrowRepository.findByIdWithLock(escrowId);

        if (!escrowOpt.isPresent()) {
            throw new IllegalArgumentException("Escrow không tồn tại");
        }

        Escrow escrow = escrowOpt.get();

        if (escrow.getStatus() != Escrow.EscrowStatus.HOLDING) {
            throw new IllegalStateException("Escrow không ở trạng thái đang giữ tiền");
        }

        // Lấy ví khách hàng
        Wallet customerWallet = escrow.getCustomerWallet();
        Optional<Wallet> walletOpt = walletRepository.findByIdWithLock(customerWallet.getId());

        if (!walletOpt.isPresent()) {
            throw new IllegalStateException("Ví khách hàng không tồn tại");
        }

        Wallet wallet = walletOpt.get();

        // Tạo giao dịch hoàn tiền
        Transaction transaction = transactionService.createRefundTransaction(wallet, escrow.getAmount(), escrow.getOrder());

        // Hoàn tiền vào ví khách hàng
        transactionService.completeRefundTransaction(transaction.getId());

        // Cập nhật trạng thái escrow
        escrow.setStatus(Escrow.EscrowStatus.REFUNDED);
        escrowRepository.save(escrow);
    }

    /**
     * Tự động giải phóng tiền cho các đơn hàng đã giao
     */
    @Scheduled(fixedDelay = 60000) // Chạy mỗi 1 phút
    @Transactional
    public void autoReleaseEscrow() {
        List<Escrow> pendingEscrows = escrowRepository.findPendingReleaseEscrows();

        for (Escrow escrow : pendingEscrows) {
            try {
                releaseEscrow(escrow.getId());
            } catch (Exception e) {
                // Log lỗi và tiếp tục với escrow tiếp theo
                e.printStackTrace();
            }
        }
    }


    @Transactional
    public Escrow createCODEscrow(Order order, Wallet shopWallet, BigDecimal amount) {
        // Tạo escrow cho COD
        Escrow escrow = new Escrow();
        escrow.setOrder(order);
        escrow.setAmount(amount);
        escrow.setStatus(Escrow.EscrowStatus.HOLDING);
        escrow.setCustomerWallet(null); // COD không có customer wallet
        escrow.setShopWallet(shopWallet);
        escrow.setPaymentMethod("COD");

        // Tạo transaction tracking cho COD
        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setType(Transaction.TransactionType.COD_ESCROW);
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        transaction.setOrder(order);
        transaction.setTargetWallet(null); // Không có wallet cụ thể
        transaction.setDescription("Tạo escrow COD cho đơn hàng #" + order.getId());

        transactionService.saveTransaction(transaction);

        System.out.println("Đã tạo COD escrow cho đơn hàng " + order.getId());
        return escrowRepository.save(escrow);
    }
}

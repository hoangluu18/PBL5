package com.pbl5.client.service.payment;


import com.pbl5.client.exception.InsufficientBalanceException;
import com.pbl5.client.repository.OrderRepository;
import com.pbl5.client.repository.OrderTrackRepository;
import com.pbl5.client.repository.payment.EscrowRepository;
import com.pbl5.client.repository.payment.WalletRepository;

import com.pbl5.common.entity.Order;
import com.pbl5.common.entity.Escrow;
import com.pbl5.common.entity.Transaction;
import com.pbl5.common.entity.Wallet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;


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

    @Autowired
    private OrderTrackRepository orderTrackRepository;

    @Autowired
    private OrderRepository orderRepository;

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
    public void releaseEscrow(Escrow escrow) {
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

        // LƯU TRANSACTION TRƯỚC KHI SỬ DỤNG ID
        transaction = transactionService.saveTransaction(transaction);
//
//        // Sau khi lưu, transaction sẽ có ID
//        if (transaction.getId() != null) {
//            transactionService.completeRefundTransaction(transaction.getId());
//        } else {
//            System.err.println("Không thể hoàn thành giao dịch vì ID là null");
//        }
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
     * Tự động giải phóng tiền escrow sau thời gian quy định (2 phút)
     * Chạy mỗi 1 phút
     * Wallet, COD
     */
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void autoReleaseEscrow() {
        System.out.println("Auto releaseEscrow is running...");
        try {
            List<Integer> pendingOrderIds = escrowRepository.findPendingOrderIdsNative();

            if (pendingOrderIds.isEmpty()) {
                return;
            }

            Date now = new Date();

            for (Integer orderId : pendingOrderIds) {
                try {
                    Optional<Order> orderOpt = orderRepository.findById(orderId);
                    if (!orderOpt.isPresent()) {
                        continue;
                    }

                    Escrow escrow = orderOpt.get().getEscrow();
                    Order order = orderOpt.get();

                    Date deliveryTime = orderTrackRepository.findDeliveryTimeByOrderId(order.getId());

                    if (deliveryTime == null) {
                        continue;
                    }

                    long elapsedTime = now.getTime() - deliveryTime.getTime();
                    long requiredTime = 2 * 60 * 1000; // 2 phút

                    if (elapsedTime >= requiredTime) {
                        // Giải phóng cho cả WALLET và COD
                        if ("COD".equals(escrow.getPaymentMethod())) {
                            releaseCODEscrow(escrow);
                            System.out.println("Đã tự động giải phóng COD escrow cho đơn hàng " + order.getId());
                        } else {
                            releaseEscrow(escrow);
                            System.out.println("Đã tự động giải phóng wallet escrow cho đơn hàng " + order.getId());
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    //COD
    /**
     * Tạo COD Escrow khi đơn hàng DELIVERED (không cần ví customer)
     */
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


    /**
     * Giải phóng tiền COD cho shop (tương tự wallet)
     */
    @Transactional
    public void releaseCODEscrow(Escrow escrow) {
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

        // Tạo giao dịch chuyển tiền COD
        Transaction transaction = new Transaction();
        transaction.setAmount(escrow.getAmount());
        transaction.setType(Transaction.TransactionType.COD_RELEASE);
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        transaction.setTargetWallet(wallet);
        transaction.setOrder(escrow.getOrder());
        transaction.setDescription("Giải phóng tiền COD cho shop từ đơn hàng #" + escrow.getOrder().getId());

        transactionService.saveTransaction(transaction);

        System.out.println("Đã giải phóng COD escrow cho đơn hàng " + escrow.getOrder().getId());
    }

    /**
     * Hoàn tiền COD cho customer
     */
    @Transactional
    public void refundCODEscrow(Escrow escrow, Wallet customerWallet) {
        if (escrow.getStatus() != Escrow.EscrowStatus.HOLDING) {
            throw new IllegalStateException("Escrow không ở trạng thái đang giữ tiền");
        }

        // Nạp tiền vào ví customer
        walletService.depositToWallet(customerWallet, escrow.getAmount());

        // Cập nhật trạng thái escrow
        escrow.setStatus(Escrow.EscrowStatus.REFUNDED);
        escrowRepository.save(escrow);

        // Tạo giao dịch hoàn tiền COD
        Transaction transaction = new Transaction();
        transaction.setAmount(escrow.getAmount());
        transaction.setType(Transaction.TransactionType.COD_REFUND);
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        transaction.setTargetWallet(customerWallet);
        transaction.setOrder(escrow.getOrder());
        transaction.setDescription("Hoàn tiền COD cho khách hàng từ đơn hàng #" + escrow.getOrder().getId());

        transactionService.saveTransaction(transaction);

        System.out.println("Đã hoàn tiền COD cho khách hàng từ đơn hàng " + escrow.getOrder().getId());
    }






}

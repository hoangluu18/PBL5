package com.pbl5.admin.controller.shop;

import com.pbl5.admin.dto.TransactionDTO;
import com.pbl5.admin.repository.OrderRepository;
import com.pbl5.admin.service.payment.TransactionService;
import com.pbl5.admin.service.payment.WalletService;
import com.pbl5.admin.service.shop.ShopProfileService;
import com.pbl5.common.entity.*;
import com.pbl5.admin.repository.shop.ShopRepository;
import com.pbl5.admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/shop/wallet")
@CrossOrigin(origins = "*")
public class ShopWalletController {

    @Autowired
    private WalletService walletService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private ShopProfileService shopProfileService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private OrderRepository orderRepository;

    /**
     * Lấy thông tin ví của shop theo userId
     */
    @GetMapping("/info/{userId}")
    public ResponseEntity<?> getShopWalletInfo(@PathVariable Integer userId) {
        try {
            // Lấy shop từ userId
            Integer shopId = shopProfileService.getShopIdByUserId(userId);
            if (shopId == null) {
                return ResponseEntity.badRequest().body("Không tìm thấy shop cho user này");
            }

            Optional<Shop> shopOpt = shopRepository.findById(shopId);
            if (!shopOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Shop không tồn tại");
            }

            Shop shop = shopOpt.get();
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest().body("User không tồn tại");
            }

            User user = userOpt.get();

            // Lấy hoặc tạo ví cho shop
            Wallet wallet = walletService.getOrCreateUserWallet(userId, user);

            Map<String, Object> response = new HashMap<>();
            response.put("id", wallet.getId());
            response.put("balance", wallet.getBalance());
            response.put("status", wallet.getStatus());
            response.put("shopName", shop.getName());
            response.put("shopId", shopId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * Lấy lịch sử giao dịch của shop theo userId (bao gồm cả giao dịch hoàn tiền)
     */
    @GetMapping("/transactions/{userId}")
    public ResponseEntity<?> getShopTransactions(@PathVariable Integer userId) {
        try {
            // Lấy shop từ userId
            Integer shopId = shopProfileService.getShopIdByUserId(userId);
            if (shopId == null) {
                return ResponseEntity.badRequest().body("Không tìm thấy shop cho user này");
            }

            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest().body("User không tồn tại");
            }

            User user = userOpt.get();

            // Lấy ví của shop
            Wallet wallet = walletService.getOrCreateUserWallet(userId, user);

            // Lấy lịch sử giao dịch từ ví
            List<Transaction> walletTransactions = transactionService.getTransactionsByWallet(wallet);
            List<TransactionDTO> transactionDTOs = TransactionDTO.fromEntityList(walletTransactions);

            // Lấy thêm thông tin giao dịch hoàn tiền từ các đơn hàng REFUNDED
            List<Order> refundedOrders = orderRepository.findByShopIdAndOrderStatus(shopId, Order.OrderStatus.REFUNDED);

            for (Order order : refundedOrders) {
                TransactionDTO refundTransactionDTO = new TransactionDTO();
                refundTransactionDTO.setId(order.getId()); // Dùng orderId làm transaction ID tạm thời
                refundTransactionDTO.setType("REFUND");
                refundTransactionDTO.setAmount(BigDecimal.valueOf(order.getTotal()));
                refundTransactionDTO.setStatus("COMPLETED");
                refundTransactionDTO.setOrderId(order.getId());

                Date time = transactionService.getTimeUpdateRefundTransactionByOrderId(order.getId());
                refundTransactionDTO.setCreatedAt(time);

                // Lấy lý do hoàn tiền từ note của order
                String refundReason = order.getNote() != null ? order.getNote() : "Hoàn tiền đơn hàng";
                refundTransactionDTO.setDescription("Hoàn tiền cho khách hàng - " + refundReason);

                transactionDTOs.add(refundTransactionDTO);
            }

            // Sắp xếp theo thời gian tạo (mới nhất trước)
            transactionDTOs.sort((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()));

            return ResponseEntity.ok(transactionDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * Lấy thống kê giao dịch của shop
     */
    @GetMapping("/statistics/{userId}")
    public ResponseEntity<?> getShopWalletStatistics(@PathVariable Integer userId) {
        try {
            // Lấy shop từ userId
            Integer shopId = shopProfileService.getShopIdByUserId(userId);
            if (shopId == null) {
                return ResponseEntity.badRequest().body("Không tìm thấy shop cho user này");
            }

            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest().body("User không tồn tại");
            }

            User user = userOpt.get();
            Wallet wallet = walletService.getOrCreateUserWallet(userId, user);

            // Lấy giao dịch từ ví
            List<Transaction> walletTransactions = transactionService.getTransactionsByWallet(wallet);

            // Lấy các đơn hàng hoàn tiền
            List<Order> refundedOrders = orderRepository.findByShopIdAndOrderStatus(shopId, Order.OrderStatus.REFUNDED);

            // Tính tổng tiền nhận được từ ví (ESCROW_RELEASE)
            double totalReceived = walletTransactions.stream()
                    .filter(t -> "ESCROW_RELEASE".equals(t.getType().toString()) &&
                            "COMPLETED".equals(t.getStatus().toString()))
                    .mapToDouble(t -> t.getAmount().doubleValue())
                    .sum();

            // Tính tổng hoàn tiền từ ví
            double totalRefundedFromWallet = walletTransactions.stream()
                    .filter(t -> "REFUND".equals(t.getType().toString()) &&
                            "COMPLETED".equals(t.getStatus().toString()))
                    .mapToDouble(t -> t.getAmount().doubleValue())
                    .sum();

            // Tính tổng hoàn tiền từ đơn hàng REFUNDED
            double totalRefundedFromOrders = refundedOrders.stream()
                    .mapToDouble(order -> order.getTotal().doubleValue())
                    .sum();

            // Tổng hoàn tiền = hoàn tiền từ ví + hoàn tiền từ đơn hàng
            double totalRefunded = totalRefundedFromWallet + totalRefundedFromOrders;

            // Tính tổng số giao dịch = giao dịch từ ví + đơn hàng hoàn tiền
            long totalTransactionsFromWallet = walletTransactions.stream()
                    .filter(t -> "COMPLETED".equals(t.getStatus().toString()))
                    .count();

            long totalTransactions = totalTransactionsFromWallet + refundedOrders.size();

            // Tạo response
            Map<String, Object> statistics = new HashMap<>();
            statistics.put("totalReceived", totalReceived);
            statistics.put("totalRefunded", totalRefunded);
            statistics.put("totalRefundedFromWallet", totalRefundedFromWallet); // Chi tiết hoàn tiền từ ví
            statistics.put("totalRefundedFromOrders", totalRefundedFromOrders); // Chi tiết hoàn tiền từ đơn hàng
            statistics.put("totalTransactions", totalTransactions);
            statistics.put("currentBalance", wallet.getBalance());
            statistics.put("refundedOrdersCount", refundedOrders.size()); // Số đơn hàng đã hoàn tiền

            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}
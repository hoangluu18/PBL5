package com.pbl5.client.controller.payment;


import com.pbl5.client.dto.payment.DepositRequest;
import com.pbl5.client.dto.payment.TransactionDTO;
import com.pbl5.client.repository.payment.WalletRepository;
import com.pbl5.client.service.payment.TransactionService;
import com.pbl5.client.service.payment.WalletService;
import com.pbl5.common.entity.Customer;
import com.pbl5.common.entity.Transaction;
import com.pbl5.common.entity.Wallet;
import com.pbl5.client.repository.CustomerRepository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "*")
public class WalletController {


    @Autowired
    private WalletService walletService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private WalletRepository walletRepository;
    @Autowired
    private CustomerRepository customerRepository;

    /**
     * Lấy thông tin ví
     */
    @GetMapping("/{customerId}")
    public ResponseEntity<?> getWallet(@PathVariable Integer customerId) {
        try {
            Optional<Customer> customerOpt = customerRepository.findById(customerId);

            if (!customerOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Customer customer = customerOpt.get();
            Wallet wallet = walletService.getOrCreateCustomerWallet(customerId, customer);

            Map<String, Object> response = new HashMap<>();
            response.put("id", wallet.getId());
            response.put("balance", wallet.getBalance());
            response.put("status", wallet.getStatus());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * Nạp tiền vào ví
     */
    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody DepositRequest request) {
        try {
            Optional<Customer> customerOpt = customerRepository.findById(request.getCustomerId());

            if (!customerOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Customer customer = customerOpt.get();
            Wallet wallet = walletService.getOrCreateCustomerWallet(request.getCustomerId(), customer);

            // Số tiền nạp phải lớn hơn 0
            if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().body("Số tiền nạp phải lớn hơn 0");
            }

            // Tạo giao dịch nạp tiền
            Transaction transaction = transactionService.createDepositTransaction(wallet, request.getAmount());

            // Cập nhật số dư trong ví (đơn giản hóa, trong thực tế cần flow phức tạp hơn với xác nhận)
            transactionService.completeDepositTransaction(transaction.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Nạp tiền thành công");
            response.put("transactionId", transaction.getId());
            response.put("amount", transaction.getAmount());
            response.put("newBalance", wallet.getBalance());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * Lấy lịch sử giao dịch
     */
    @GetMapping("/{customerId}/transactions")
    public ResponseEntity<?> getTransactions(@PathVariable Integer customerId) {
        try {
            Optional<Customer> customerOpt = customerRepository.findById(customerId);

            if (!customerOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Customer customer = customerOpt.get();
            Wallet wallet = walletService.getOrCreateCustomerWallet(customerId, customer);

            List<Transaction> transactions = transactionService.getTransactionsByWallet(wallet);

            // Chuyển đổi sang DTO trước khi trả về
            List<TransactionDTO> transactionDTOs = TransactionDTO.fromEntityList(transactions);

            return ResponseEntity.ok(transactionDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * Kiểm tra số dư
     */
    @GetMapping("/{customerId}/check-balance")
    public ResponseEntity<?> checkBalance(@PathVariable Integer customerId, @RequestParam BigDecimal amount) {
        try {
            Optional<Customer> customerOpt = customerRepository.findById(customerId);

            if (!customerOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Customer customer = customerOpt.get();
            Wallet wallet = walletService.getOrCreateCustomerWallet(customerId, customer);

            boolean hasEnough = walletService.hasEnoughBalance(wallet, amount);

            Map<String, Object> response = new HashMap<>();
            response.put("hasEnoughBalance", hasEnough);
            response.put("currentBalance", wallet.getBalance());
            response.put("requiredAmount", amount);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}

package com.pbl5.client.controller.payment;


import com.pbl5.client.dto.payment.RefundRequest;
import com.pbl5.client.exception.InsufficientBalanceException;


import com.pbl5.client.dto.payment.PaymentRequest;
import com.pbl5.client.repository.*;
import com.pbl5.client.repository.payment.EscrowRepository;
import com.pbl5.client.service.payment.EscrowService;
import com.pbl5.client.service.payment.WalletService;
import com.pbl5.client.service.OrderService;
import com.pbl5.common.entity.*;

import com.pbl5.common.entity.Escrow;
import com.pbl5.common.entity.Wallet;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

//    @Autowired
//    private WalletService walletService;
//
//    @Autowired
//    private EscrowService escrowService;
//
//    @Autowired
//    private CustomerRepository customerRepository;
//
//    @Autowired
//    private OrderRepository orderRepository;
//
//    @Autowired
//    private ShopRepository shopRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private OrderService orderService;
//
//    @Autowired
//    private EscrowRepository escrowRepository;

    private final WalletService walletService;
    private final EscrowService escrowService;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final ShopRepository shopRepository;
    private final UserRepository userRepository;
    private final OrderService orderService;
    private final EscrowRepository escrowRepository;
    private final OrderTrackRepository orderTrackRepository;

    public PaymentController(WalletService walletService, EscrowService escrowService,
                      CustomerRepository customerRepository, OrderRepository orderRepository,
                      ShopRepository shopRepository, UserRepository userRepository,
                      OrderService orderService, EscrowRepository escrowRepository, OrderTrackRepository orderTrackRepository) {
        this.walletService = walletService;
        this.escrowService = escrowService;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.shopRepository = shopRepository;
        this.userRepository = userRepository;
        this.orderService = orderService;
        this.escrowRepository = escrowRepository;
        this.orderTrackRepository = orderTrackRepository;
    }

    /**
     * Thanh toán đơn hàng bằng ví
     */
    @PostMapping("/pay")
    public ResponseEntity<?> pay(@RequestBody PaymentRequest request) {
        try {
            Optional<Customer> customerOpt = customerRepository.findById(request.getCustomerId());
            Optional<Order> orderOpt = orderRepository.findById(request.getOrderId());

            if (!customerOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Khách hàng không tồn tại");
            }

            if (!orderOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Đơn hàng không tồn tại");
            }

            Customer customer = customerOpt.get();
            Order order = orderOpt.get();

            // Lấy ví khách hàng
            Wallet customerWallet = walletService.getOrCreateCustomerWallet(request.getCustomerId(), customer);

            // Lấy shop từ order
            Optional<Shop> shopOpt = shopRepository.findById(order.getShop().getId());
            if (!shopOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Shop không tồn tại");
            }
            Shop shop = shopOpt.get();

            // Lấy user của shop
            Optional<User> userOpt = userRepository.findById(shop.getUser().getId());
            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest().body("User của shop không tồn tại");
            }
            User user = userOpt.get();

            // Lấy ví shop
            Wallet shopWallet = walletService.getOrCreateUserWallet(user.getId(), user);

            BigDecimal amount = BigDecimal.valueOf(order.getTotal());

            try {
                // Tạo escrow (giữ tiền và trừ tiền từ ví khách hàng)
                Escrow escrow = escrowService.createEscrow(order, customerWallet, shopWallet, amount);

                // Cập nhật trạng thái đơn hàng
                order.setPaymentMethod(Order.PaymentMethod.WALLET);
                orderService.updateOrderStatus(order, Order.OrderStatus.PAID);

                Map<String, Object> response = new HashMap<>();
                response.put("message", "Thanh toán thành công");
                response.put("orderId", order.getId());
                response.put("amount", amount);
                response.put("escrowId", escrow.getId());

                return ResponseEntity.ok(response);
            } catch (InsufficientBalanceException e) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Số dư không đủ");
                response.put("currentBalance", customerWallet.getBalance());
                response.put("requiredAmount", amount);

                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * Hoàn tiền đơn hàng
     */
    @PostMapping("/refund/{orderId}")
    public ResponseEntity<?> refund(@PathVariable Integer orderId, @RequestBody RefundRequest request) {
        try {
            Optional<Order> orderOpt = orderRepository.findById(orderId);

            if (!orderOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Đơn hàng không tồn tại");
            }

            Order order = orderOpt.get();
            System.out.println("order id: " + order.getId());
            // Tìm escrow cho đơn hàng
            Escrow escrowOpt = order.getEscrow();

            if (escrowOpt == null) {
                return ResponseEntity.badRequest().body("Không tìm thấy escrow cho đơn hàng này");
            }

            Escrow escrow = escrowOpt;

            // Kiểm tra trạng thái của escrow
            if (escrow.getStatus() != Escrow.EscrowStatus.HOLDING) {
                return ResponseEntity.badRequest().body("Không thể hoàn tiền vì tiền không ở trạng thái đang giữ");
            }

            // Hoàn tiền từ escrow về ví khách hàng
            if (order.getPaymentMethod() == Order.PaymentMethod.WALLET) {
                // Hoàn tiền cho Wallet (giữ nguyên code cũ)
                escrowService.refundEscrow(escrow.getId());
            }else if (order.getPaymentMethod() == Order.PaymentMethod.COD) {
                // Hoàn tiền cho COD
                // Lấy ví của khách hàng
                Customer customer = order.getCustomer();
                Wallet customerWallet = walletService.getOrCreateCustomerWallet(customer.getId(), customer);

                // Gọi hàm hoàn tiền COD
                escrowService.refundCODEscrow(escrow, customerWallet);
            }


            // Cập nhật ghi chú và trạng thái đơn hàng
            order.setNote(request.getReason());
            order.setOrderStatus(Order.OrderStatus.REFUNDED);
            orderRepository.save(order);

            // Tạo theo dõi đơn hàng
            OrderTrack orderTrack = new OrderTrack();
            orderTrack.setOrder(order);
            orderTrack.setStatus(OrderTrack.OrderStatus.REFUNDED);
            orderTrack.setUpdatedTime(new Date());
            orderTrack.setNotes("Đơn hàng đã được hoàn tiền. Lý do: " + request.getReason());
            orderTrackRepository.save(orderTrack);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Hoàn tiền thành công");
            response.put("orderId", order.getId());
            response.put("amount", escrow.getAmount());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * Kiểm tra trạng thái thanh toán của đơn hàng
     */
    @GetMapping("/status/{orderId}")
    public ResponseEntity<?> checkPaymentStatus(@PathVariable Integer orderId) {
        try {
            String status = escrowRepository.findStatusById(orderId);
            Map<String, Object> response = new HashMap<>();
            response.put("escrowStatus", status);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}

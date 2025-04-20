package com.pbl5.client.controller.aws;

import com.pbl5.client.service.CustomerService;

import com.pbl5.client.service.aws.s3.S3StorageService;
import com.pbl5.common.entity.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin("*") // Hoặc cấu hình cụ thể
public class CustomerAvatarController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private S3StorageService s3StorageService;

    @PostMapping("/{customerId}/avatar")
    public ResponseEntity<?> uploadAvatar(
            @PathVariable Integer customerId,
            @RequestParam("file") MultipartFile file) {
        try {
            // Kiểm tra khách hàng tồn tại
            Optional<Customer> customerOpt = customerService.getCustomerById(customerId);
            if (!customerOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Customer customer = customerOpt.get();

            // Xóa avatar cũ nếu có
            if (customer.getAvatar() != null && !customer.getAvatar().isEmpty()) {
                s3StorageService.deleteFile(customer.getAvatar());
                System.out.println("Xóa avatar cũ: " + customer.getAvatar());
            }

            // Upload avatar mới
            String avatarUrl = s3StorageService.uploadFile(file);

            // Cập nhật URL avatar trong database
            customer.setAvatar(avatarUrl);
            customerService.saveCustomer(customer);

            // Trả về URL của avatar mới
            Map<String, String> response = new HashMap<>();
            response.put("avatarUrl", avatarUrl);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
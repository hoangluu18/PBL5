package com.pbl5.admin.service.impl.admin;

import com.pbl5.admin.dto.admin.StoreResponseDto;
import com.pbl5.admin.repository.CustomerRepository;
import com.pbl5.admin.repository.RoleRepository;
import com.pbl5.admin.repository.StoreRequestRepository;
import com.pbl5.admin.repository.UserRepository;
import com.pbl5.admin.repository.shop.ShopRepository;
import com.pbl5.admin.service.admin.StoreRequestService;

import com.pbl5.common.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StoreRequestServiceImpl implements StoreRequestService {

    @Autowired
    private StoreRequestRepository storeRequestRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private RoleRepository roleRepository;

    private BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    private UUID uuid ;


    @Override
    public List<StoreResponseDto> getAllStoreRequests() {
        List<StoreResponseDto> res = new ArrayList<>();

        List<StoreRequest> storeRequests = storeRequestRepository.findAll();
        for (StoreRequest storeRequest : storeRequests) {
            StoreResponseDto storeResponseDto = new StoreResponseDto();

            storeResponseDto.setId(storeRequest.getId());
            storeResponseDto.setStoreName(storeRequest.getStoreName());
            storeResponseDto.setDescription(storeRequest.getDescription());
            storeResponseDto.setStatus(storeRequest.getStatus());
            storeResponseDto.setAddress(storeRequest.getAddress());
            storeResponseDto.setPhoneNumber(storeRequest.getPhoneNumber());
            storeResponseDto.setResponseNote(storeRequest.getResponseNote());
            storeResponseDto.setResponseDate(storeRequest.getResponseDate() != null ? storeRequest.getResponseDate().toString() : null);
            storeResponseDto.setRequestDate(storeRequest.getRequestDate() != null ? storeRequest.getRequestDate().toString() : null);

            Customer customer = storeRequest.getCustomer();

            storeResponseDto.setCustomerId(customer.getId());
            storeResponseDto.setCustomerName(customer.getFullName());
            storeResponseDto.setCustomerEmail(customer.getEmail());

            res.add(storeResponseDto);
        }

        return res;
    }

    @Override
    public String respondToStoreRequest(Integer id, String response, String responseNote) {
        StoreRequest storeRequest = storeRequestRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Store request not found with id: " + id));
        Customer customer = customerRepository.findById(storeRequest.getCustomer().getId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + storeRequest.getCustomer().getId()));

        if(response.equals("approve")) {
            storeRequest.setStatus(1); // Assuming 1 means approved
            User user = setUser(customer);
            String rawPassword = uuid.randomUUID().toString().substring(0, 8);
            user.setPassword(bCryptPasswordEncoder.encode(rawPassword));
            responseNote = generateResponseNote(user.getEmail(), rawPassword);
            storeRequest.setResponseNote(responseNote);

            User createdUser = userRepository.save(user);
            setShop(storeRequest, createdUser);
        } else if(response.equals("reject")) {
            storeRequest.setStatus(2); // Assuming 2 means rejected
            storeRequest.setResponseNote(responseNote);
        } else {
            throw new IllegalArgumentException("Invalid response type: " + response);
        }
        storeRequest.setResponseDate(new Date());
        storeRequestRepository.save(storeRequest);
        return responseNote;
    }

    private void setShop(StoreRequest storeRequest, User user) {
        Shop shop = new Shop();
        shop.setName(storeRequest.getStoreName());
        shop.setDescription(storeRequest.getDescription());
        shop.setAddress(storeRequest.getAddress());
        shop.setPhone(storeRequest.getPhoneNumber());
        shop.setUser(user);
        shop.setEnabled(true);
        shop.setCreatedAt(new Date());
        int lioc = storeRequest.getAddress().lastIndexOf(",");
        shop.setCity(storeRequest.getAddress().substring(lioc+2));
        shopRepository.save(shop);
    }

    private User setUser(Customer customer) {
        User user = new User();
        user.setEmail(customer.getEmail());
        user.setEnabled(true);
        user.setFirstName(customer.getFirstName());
        user.setLastName(customer.getLastName());
        Role role = roleRepository.findByName("Seller");
        user.setRoles(Set.of(role));
        return user;
    }

    private String generateResponseNote(String email, String rawPassword) {
        return  "<div style='font-family: Arial, sans-serif; padding: 20px; text-align: center;'>" +
                "<h3 style='color: #28a745; margin: 0 0 15px 0;'>🎉 Chúc mừng!</h3>" +
                "<p style='margin: 0 0 20px 0;'>Yêu cầu mở cửa hàng đã được phê duyệt thành công.</p>" +

                "<div style='background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: left;'>" +
                "<strong>📧 Thông tin đăng nhập:</strong><br>" +
                "Email: <strong>" + email + "</strong><br>" +
                "Mật khẩu: <strong>" + rawPassword + "</strong>" +
                "</div>" +

                "<div style='background: #fff3cd; padding: 10px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ffc107;'>" +
                "<small>🔐 Vui lòng thay đổi mật khẩu sau lần đăng nhập đầu tiên.</small>" +
                "</div>" +

                "<p style='margin: 15px 0;'>🌐 Truy cập: <a href='http://localhost:5172' target='_blank'>http://localhost:5172</a></p>" +

                "<p style='margin: 15px 0 0 0; color: #28a745;'><strong>Chúc bạn kinh doanh thành công! 🚀</strong></p>" +
                "</div>";
    }
}

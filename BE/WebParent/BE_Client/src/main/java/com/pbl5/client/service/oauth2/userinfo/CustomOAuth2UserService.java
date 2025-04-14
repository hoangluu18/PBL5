package com.pbl5.client.service.oauth2.userinfo;

import com.pbl5.client.repository.CustomerRepository;
import com.pbl5.client.security.oauth2.OAuth2UserPrincipal;
import com.pbl5.common.entity.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        try {
            return processOAuth2User(userRequest, oAuth2User);
        } catch (Exception ex) {
            throw new OAuth2AuthenticationException(ex.getMessage());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        // Extract OAuth2 user info
        OAuth2UserInfo oAuth2UserInfo = new GoogleOAuth2UserInfo(oAuth2User.getAttributes());

        // Check if email is available
        if (StringUtils.isEmpty(oAuth2UserInfo.getEmail())) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        // Check if user exists
        Optional<Customer> userOptional = Optional.ofNullable(customerRepository.findByEmail(oAuth2UserInfo.getEmail()));
        Customer customer;

        if (userOptional.isPresent()) {
            customer = userOptional.get();
            // Update existing user
            // Xử lý tên đầy đủ
            String fullName = oAuth2UserInfo.getName();
            if (fullName != null) {
                // Tách họ và tên nếu có thể
                String[] nameParts = fullName.split("\\s+", 2);
                if (nameParts.length > 1) {
                    customer.setFirstName(nameParts[0]);
                    customer.setLastName(nameParts[1]);
                } else {
                    customer.setFirstName(fullName);
                    customer.setLastName("");  // Hoặc có thể dùng một giá trị mặc định khác
                }

            } else {
                // Xử lý trường hợp không có tên từ OAuth2
                String emailPrefix = oAuth2UserInfo.getEmail().split("@")[0];
                customer.setFirstName(emailPrefix);
                customer.setLastName("");
            }
            if (oAuth2UserInfo.getImageUrl() != null) {
                if(customer.getAvatar() == null || customer.getAvatar().isEmpty()){
                    customer.setAvatar(oAuth2UserInfo.getImageUrl());
                }
            }
            customer.setAuthenticationType(Customer.AuthenticationType.GOOGLE);
            customer = customerRepository.save(customer);
        } else {
            // Register new user
            customer = registerNewUser(oAuth2UserInfo);
        }

        return new OAuth2UserPrincipal(customer, oAuth2User.getAttributes());
    }

    private Customer registerNewUser(OAuth2UserInfo oAuth2UserInfo) {
        Customer customer = new Customer();

        // Thiết lập email từ OAuth2
        customer.setEmail(oAuth2UserInfo.getEmail());

        // Xử lý tên đầy đủ
        String fullName = oAuth2UserInfo.getName();
        if (fullName != null) {
            // Tách họ và tên nếu có thể
            String[] nameParts = fullName.split("\\s+", 2);
            if (nameParts.length > 1) {
                customer.setFirstName(nameParts[0]);
                customer.setLastName(nameParts[1]);
            } else {
                customer.setFirstName(fullName);
                customer.setLastName("");  // Hoặc có thể dùng một giá trị mặc định khác
            }

        } else {
            // Xử lý trường hợp không có tên từ OAuth2
            String emailPrefix = oAuth2UserInfo.getEmail().split("@")[0];
            customer.setFirstName(emailPrefix);
            customer.setLastName("");
        }

        // Thiết lập avatar nếu có
        if (oAuth2UserInfo.getImageUrl() != null) {
            customer.setAvatar(oAuth2UserInfo.getImageUrl());
        }

        // Các trường bắt buộc khác
        customer.setEnabled(true);
        customer.setCreatedAt(new Date());
        customer.setPassword(UUID.randomUUID().toString());
        customer.setAuthenticationType(Customer.AuthenticationType.GOOGLE);
        // Thêm các giá trị mặc định cho các trường bắt buộc khác
        customer.setPhoneNumber("Chưa cập nhật"); // Nếu phone number là bắt buộc

        try {
            return customerRepository.save(customer);
        } catch (Exception e) {
            // Ghi log chi tiết để debug
            System.err.println("ERROR creating new user from OAuth2: " + e.getMessage());
            e.printStackTrace();
            throw new OAuth2AuthenticationException("Không thể tạo tài khoản mới: " + e.getMessage());
        }
    }
}
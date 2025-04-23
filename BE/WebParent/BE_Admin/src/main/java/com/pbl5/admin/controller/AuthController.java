package com.pbl5.admin.controller;

import com.pbl5.admin.dto.auth.AuthRequest;
import com.pbl5.admin.dto.auth.AuthResponse;
import com.pbl5.admin.exception.UserNotFoundException;
import com.pbl5.admin.security.CustomUserDetails;
import com.pbl5.admin.security.jwt.JwtTokenService;

import com.pbl5.admin.service.UserService;
import com.pbl5.common.entity.Customer;

import com.pbl5.common.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenService tokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid AuthRequest request) {

        try {
            User user = userService.findByEmail(request.getEmail());
            if (!user.isEnabled()) {
                return ResponseEntity.status(401).body("Tài khoản chưa được xác thực");
            }

            Authentication authenticate = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            CustomUserDetails userDetails = (CustomUserDetails) authenticate.getPrincipal();
            AuthResponse response = tokenService.generateToken(userDetails.getUser());

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException | UserNotFoundException e) {
            return ResponseEntity.status(401).body("Email hoặc mật khẩu không đúng");
        }
    }


//    @PostMapping("/forgot-password")
//    public ResponseEntity<?> forgotPassword(HttpServletRequest request) throws MessagingException {
//
//        try {
//            String email = request.getParameter("email");
//            Customer customer = customerService.updateResetPasswordToken(email);
//
//            sendResetPassword(request, customer);
//            return ResponseEntity.ok("Mã xác thực đã được gửi đến email của bạn");
//        } catch (CustomerNotFoundException e) {
//            return ResponseEntity.notFound().build();
//        }
//
//    }
//
//    @GetMapping("/reset-password")
//    public ResponseEntity<?> resetPassword(@RequestParam String token) {
//        try {
//            Customer customer = customerService.findByResetPasswordToken(token);
//            return ResponseEntity.ok("Mã xác thực hợp lệ");
//        } catch (CustomerNotFoundException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @PostMapping("/reset-password")
//    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
//        try {
//            customerService.updatePassword(token, newPassword);
//
//            return ResponseEntity.ok("Đặt lại mật khẩu thành công");
//        } catch (CustomerNotFoundException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//
//    private void sendResetPassword(HttpServletRequest request, Customer customer) throws MessagingException {
//        JavaMailSenderImpl javaMailSender = MailUtils.mailSenderImpl();
//
//        String subject = "Đặt lại mật khẩu";
//        String verifyURL = Constants.FE_URL + "/reset-password?token=" + customer.getResetPasswordToken();
//
//        String content = "<p>Chào <strong>" + customer.getFullName() + "</strong>,</p>"
//                + "<p>Vui lòng nhấn vào liên kết sau để đặt lại mật khẩu của bạn:</p>"
//                + "<p><a href=\"" + verifyURL + "\">Đặt lại mật khẩu</a></p>"
//                + "<br><p>Xin cảm ơn!</p>";
//
//        MimeMessage message = javaMailSender.createMimeMessage();
//        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
//
//        helper.setTo(customer.getEmail());
//        helper.setSubject(subject);
//        helper.setFrom("thanhadp2402@gmail.com");
//        helper.setText(content, true);
//
//        javaMailSender.send(message);
//    }

}

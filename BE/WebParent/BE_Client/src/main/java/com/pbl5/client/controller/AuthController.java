package com.pbl5.client.controller;

import com.pbl5.client.common.Constants;

import com.pbl5.client.dto.auth.AuthRequest;
import com.pbl5.client.dto.auth.AuthResponse;
import com.pbl5.client.exception.CustomerNotFoundException;
import com.pbl5.client.security.CustomUserDetails;
import com.pbl5.client.security.jwt.JwtTokenService;
import com.pbl5.client.service.CustomerService;
import com.pbl5.client.utils.MailUtils;
import com.pbl5.common.entity.Customer;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(Constants.FE_URL)
public class AuthController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private JwtTokenService tokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid AuthRequest request) {

        try {
            Customer customer = customerService.findByEmail(request.getEmail());
            if (!customer.isEnabled()) {
                return ResponseEntity.status(401).body("Tài khoản chưa được xác thực");
            }

            Authentication authenticate = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            CustomUserDetails userDetails = (CustomUserDetails)authenticate.getPrincipal();
            AuthResponse response = tokenService.generateToken(userDetails.getCustomer());

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException | CustomerNotFoundException e) {
            return ResponseEntity.status(401).body("Email hoặc mật khẩu không đúng");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid Customer customer, HttpServletRequest request) throws MessagingException {

        customerService.registerCustomer(customer);
        sendVerifyMail(request, customer);

        return ResponseEntity.ok("Đăng ký thành công");
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam String code) {
        boolean isVerified = customerService.verify(code);

        if (!isVerified) {
            return ResponseEntity.status(400).body("Xác thực tài khoản không thành công");
        }
        return ResponseEntity.ok("Xác thực tài khoản thành công");
    }

    private void sendVerifyMail(HttpServletRequest request, Customer customer) throws MessagingException {
        JavaMailSenderImpl javaMailSender = MailUtils.mailSenderImpl();

        String subject = "Xác thực tài khoản";
        String verifyURL = MailUtils.getSiteURL(request) + "/api/auth/verify?code=" + customer.getVerificationCode();

        String content = "<p>Chào <strong>" + customer.getFullName() + "</strong>,</p>"
                + "<p>Vui lòng nhấn vào liên kết sau để xác thực tài khoản của bạn:</p>"
                + "<p><a href=\"" + verifyURL + "\">Xác thực tài khoản</a></p>"
                + "<br><p>Xin cảm ơn!</p>";

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(customer.getEmail());
        helper.setSubject(subject);
        helper.setFrom("thanhadp2402@gmail.com");
        helper.setText(content, true);

        javaMailSender.send(message);
    }




}

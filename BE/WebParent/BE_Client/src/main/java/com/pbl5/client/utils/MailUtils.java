package com.pbl5.client.utils;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

public class MailUtils {

    public static String getSiteURL(HttpServletRequest request) {
        String url = request.getRequestURL().toString();

        return url.replace(request.getServletPath(), "");
    }

    public static JavaMailSenderImpl mailSenderImpl() {
        JavaMailSenderImpl mailSenderImpl = new JavaMailSenderImpl();

        mailSenderImpl.setHost("smtp.gmail.com");
        mailSenderImpl.setPort(587);
        mailSenderImpl.setUsername("thanhadp2402@gmail.com");
        mailSenderImpl.setPassword("aybl wkic iwsl ozez");

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.debug", "true");

        mailSenderImpl.setJavaMailProperties(props);

        return mailSenderImpl;
    }
}

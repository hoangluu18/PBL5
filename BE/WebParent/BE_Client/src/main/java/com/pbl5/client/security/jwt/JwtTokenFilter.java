package com.pbl5.client.security.jwt;

import com.pbl5.client.exception.JwtValidationException;
import com.pbl5.client.security.CustomUserDetails;
import com.pbl5.common.entity.Customer;
import io.jsonwebtoken.Claims;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
public class JwtTokenFilter  extends OncePerRequestFilter {

    private static final Logger LOGGER = LoggerFactory.getLogger(JwtTokenFilter.class);
    private static String AUTHORIZATION = "Authorization";

    @Autowired JwtUtil jwt;

    @Autowired
    @Qualifier("handlerExceptionResolver")
    HandlerExceptionResolver resolver;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if(!hasAuthorizationBearer(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String bearerToken = getBearerToken(request);
        LOGGER.info(bearerToken);

        try {
            Claims claims = jwt.validateToken(bearerToken);

            UserDetails userDetails = getUserDetails(claims);

            setAuthenticationContext(userDetails, request);

            filterChain.doFilter(request, response);

            clearAuthenticationContext();

        } catch (JwtValidationException e) {
            LOGGER.error(e.getMessage(), e);
            resolver.resolveException(request, response, null, e);
        }
    }

    private void clearAuthenticationContext() {
        SecurityContextHolder.clearContext();
    }

    private void setAuthenticationContext(UserDetails userDetails, HttpServletRequest request) {
        var authentication = new UsernamePasswordAuthenticationToken(userDetails,null,
                userDetails.getAuthorities());

        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private UserDetails getUserDetails(Claims claims) {
        String subject = (String) claims.get(Claims.SUBJECT);
        String[] arrays = subject.split(",");

        Integer customerId = Integer.valueOf(arrays[0]);
        String customerName = arrays[1];

        Customer customer = new Customer();
        customer.setId(customerId);



        return new CustomUserDetails(customer);
    }

    private boolean hasAuthorizationBearer(HttpServletRequest request) {
        String header = request.getHeader(AUTHORIZATION);

        LOGGER.info("Authorization header: " + header);
        if(StringUtils.isEmpty(header) || !header.startsWith("Bearer")) {
            return false;
        }

        return true;
    }

    private String getBearerToken(HttpServletRequest request) {
        String header = request.getHeader(AUTHORIZATION);

        String[] arrays = header.split(" ");
        if(arrays.length == 2) {
            return arrays[1];
        }
        return null;
    }
}

















































































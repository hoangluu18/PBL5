package com.pbl5.client.security.jwt;

import com.pbl5.client.exception.JwtValidationException;
import com.pbl5.common.entity.Customer;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.util.Date;

@Component
@Data
public class JwtUtil {
    private static final String SECRET_KEY_ALGORITHM = "HmacSHA512";

    @Value("${security.jwt.secret}")
    private String secretKey;

    @Value("${security.jwt.access-token.expiration}")
    private long accessTokenExpiration;

    public String generateAccessToken(Customer customer) {
        if(customer == null){
            throw new IllegalArgumentException("Customer cannot be null");
        }

        String subject = String.format("%s,%s", customer.getId(), customer.getFullName());
        long expirationTime = accessTokenExpiration * 60000 + System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(expirationTime))
                .setIssuer("PBL5")
                .claim("role", "customer")
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()), Jwts.SIG.HS512)
                .compact();
    }

    public Claims validateToken(String token) throws JwtValidationException {

        try {
            SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(), SECRET_KEY_ALGORITHM);

            return Jwts.parser().verifyWith(keySpec).build().parseSignedClaims(token).getPayload();
        } catch (ExpiredJwtException e) {
            throw new JwtValidationException("Access token expired", null);
        } catch (UnsupportedJwtException e) {
            throw new JwtValidationException("Access token unsupported", null);
        } catch (IllegalArgumentException e) {
            throw new JwtValidationException("Access token is illegal", null);
        } catch (MalformedJwtException e) {
            throw new JwtValidationException("Access token is not well formed", null);
        }
    }
}

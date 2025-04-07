package com.pbl5.client.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.pbl5.client.security.CustomUserDetails;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;


@SpringBootTest
public class AuthenticationTest {
	
	@Autowired private AuthenticationManager authManager;
	
	@Test
	public void testAuthenFail() {
		assertThrows(BadCredentialsException.class, () -> {
			authManager.authenticate(
					new UsernamePasswordAuthenticationToken("", 
							"xxx"));
		});
	}
	
	@Test
	public void testAuthenSuccess() {
		String username = "nguyenvana@example.com";
		String password = "123456";
		
		Authentication authenticate = authManager.authenticate(
				new UsernamePasswordAuthenticationToken(username, password));
		assertThat(authenticate.isAuthenticated()).isTrue();
		
		CustomUserDetails userDetails = (CustomUserDetails) authenticate.getPrincipal();
		System.out.println(userDetails.getUsername());
	}
}

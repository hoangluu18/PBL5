package com.pbl5.client.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.pbl5.client.exception.JwtValidationException;
import com.pbl5.client.security.jwt.JwtUtil;
import com.pbl5.common.entity.Customer;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;


public class JwtTest {

	private static JwtUtil jwt;
	
	@BeforeAll 
	static void setup() {
		jwt = new JwtUtil();
		jwt.setSecretKey("MySecretKeyABCDEFGHJKLMNOPQRSTUVWXYZ123456789012345678912345678909");
		jwt.setAccessTokenExpiration(2);
	}
	
	@Test
	public void testGeneratedFail() {
		assertThrows(IllegalArgumentException.class, new Executable() {
			
			@Override
			public void execute() throws Throwable {
				Customer customer = null;
				jwt.generateAccessToken(customer);
			}
		});
	}
	
	@Test
	public void testGeneratedSuccess() {
		Customer customer = new Customer();
		customer.setId(4);
		customer.setEmail("john@gmail.com");

		String token = jwt.generateAccessToken(customer);
		System.out.println(token);
		assertThat(token).isNotNull();
	}
	
	@Test
	public void testValidateFail() throws JwtValidationException {
		assertThrows(JwtValidationException.class, new Executable() {
			
			@Override
			public void execute() throws Throwable {
				jwt.validateToken("a.b.a");
			}
		});
		
	}
	
	@Test
	public void testValidateSuccess() {
		Customer customer = new Customer();
		customer.setId(4);
		customer.setEmail("john@gmail.com");

		String token = jwt.generateAccessToken(customer);
		System.out.println(token);
		assertThat(token).isNotNull();
		
		assertDoesNotThrow(() -> {
			jwt.validateToken(token);
		});
	}
}

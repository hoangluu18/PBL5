package com.pbl5.client.auth;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.pbl5.client.dto.auth.AuthRequest;
import com.pbl5.client.dto.auth.AuthResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
public class SecurityTest {

	private static String URL_AUTH = "/api/oauth/token";
	private static String URL_STUDENT = "/api/students";
	
	@Autowired private MockMvc mockMvc;
	@Autowired private ObjectMapper mapper;
	
	@Test
	public void getBaseUriShouldReturn401() throws Exception {
		mockMvc.perform(get("/"))
			.andExpect(status().isUnauthorized())
			.andDo(print());
		
	}
	
	@Test
	public void testAccessTokenBadRequest() throws Exception {
		AuthRequest authRequest = new AuthRequest();
		authRequest.setEmail("d");
		authRequest.setPassword("a");
		
		String valueAsString = mapper.writeValueAsString(authRequest);
		
		mockMvc.perform(post(URL_AUTH).contentType("application/json").content(valueAsString))
			.andExpect(status().isBadRequest())
			.andDo(print());
	}
	
	@Test
	public void testAccessTokenFail() throws Exception {
		AuthRequest authRequest = new AuthRequest();
		authRequest.setEmail("thanhdz");
		authRequest.setPassword("afdsafd");
		
		String valueAsString = mapper.writeValueAsString(authRequest);
		
		mockMvc.perform(post(URL_AUTH).contentType("application/json").content(valueAsString))
			.andExpect(status().isUnauthorized())
			.andDo(print());
	}
	
	@Test
	public void testAccessTokenSuccess() throws Exception {
		AuthRequest authRequest = new AuthRequest();
		authRequest.setEmail("thanhdz");
		authRequest.setPassword("123456");
		
		String valueAsString = mapper.writeValueAsString(authRequest);
		
		mockMvc.perform(post(URL_AUTH).contentType("application/json").content(valueAsString))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.accessToken").isNotEmpty())
			.andDo(print());
	}


	@Test
	public void testGetStudentsFail() throws Exception {
		mockMvc.perform(get(URL_STUDENT).header("Authorization", "Bearer fdasf"))
			.andExpect(status().isUnauthorized())
			.andDo(print());
	}
	
	@Test
	public void testGetStudentsSuccess() throws Exception {
		AuthRequest authRequest = new AuthRequest();
		authRequest.setEmail("thanhdz");
		authRequest.setPassword("123456");
		
		String valueAsString = mapper.writeValueAsString(authRequest);
		
		MvcResult mvcResult = mockMvc.perform(post(URL_AUTH).contentType("application/json")
				.content(valueAsString))
				.andExpect(status().isOk())
				.andReturn();
		
		String contentAsString = mvcResult.getResponse().getContentAsString();
		AuthResponse response = mapper.readValue(contentAsString, AuthResponse.class);
		
		mockMvc.perform(get(URL_STUDENT).header("Authorization", "Bearer " + response.getAccessToken()))
			.andExpect(status().isOk())
			.andDo(print());
	}
}

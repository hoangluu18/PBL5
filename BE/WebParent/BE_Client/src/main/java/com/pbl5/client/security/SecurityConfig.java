package com.pbl5.client.security;

import com.pbl5.client.security.jwt.JwtTokenFilter;
import com.pbl5.client.security.oauth2.OAuth2AuthenticationFailureHandler;
import com.pbl5.client.security.oauth2.OAuth2AuthenticationSuccessHandler;
import com.pbl5.client.service.oauth2.userinfo.CustomOAuth2UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFilter;

@Configuration
@EnableWebSecurity(debug = true)
public class SecurityConfig {

    @Autowired
    JwtTokenFilter jwtTokenFilter;

    //oauth2

    @Autowired
    private OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    @Autowired
    private OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults());


        http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/shop/*/shopInfo").permitAll()
                        .requestMatchers("/api/shop/*/product").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()  // Allow Swagger UI
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/r/vote-review", "/api/r/check-review").authenticated()
                        .requestMatchers("/api/p/**", "/api/r/**", "/api/c/**").permitAll()
                        .requestMatchers("/api/customers/checkUniqueEmail").permitAll()
                        .requestMatchers("/oauth2/**").permitAll()
                        .anyRequest().authenticated()

                )
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(authEndpoint ->
                                authEndpoint.baseUri("/oauth2/authorization"))
                        .redirectionEndpoint(redirectEndpoint ->
                                redirectEndpoint.baseUri("/api/auth/oauth2/code/*"))
                        .userInfoEndpoint(userInfo ->
                                userInfo.userService(customOAuth2UserService))
                        .successHandler(oAuth2AuthenticationSuccessHandler)
                        .failureHandler(oAuth2AuthenticationFailureHandler))
                .exceptionHandling(exh -> exh.authenticationEntryPoint((request, response, authException) -> {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                }))
                .addFilterBefore(jwtTokenFilter, AuthenticationFilter.class);


        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    UserDetailsService userDetailsService(){
        return new CustomUserDetailsService();
    }

    @Bean
    DaoAuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}

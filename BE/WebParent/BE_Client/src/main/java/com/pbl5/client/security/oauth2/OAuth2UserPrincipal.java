package com.pbl5.client.security.oauth2;

import com.pbl5.client.security.CustomUserDetails;
import com.pbl5.common.entity.Customer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

public class OAuth2UserPrincipal extends CustomUserDetails implements OAuth2User {

    private Map<String, Object> attributes;

    public OAuth2UserPrincipal(Customer customer, Map<String, Object> attributes) {
        super(customer);
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public String getName() {
        return this.getUsername();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return super.getAuthorities();
    }
}
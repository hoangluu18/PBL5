// OAuth2UserInfo.java
package com.pbl5.client.service.oauth2.userinfo;

public interface OAuth2UserInfo {
    String getId();
    String getName();
    String getEmail();
    String getImageUrl();
}
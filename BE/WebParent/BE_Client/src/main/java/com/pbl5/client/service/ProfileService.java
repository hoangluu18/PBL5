package com.pbl5.client.service;

import com.pbl5.client.dto.ProfileDto;

public interface ProfileService {
    ProfileDto getProfileByCustomerId(Long id);

}
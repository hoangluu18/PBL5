package com.pbl5.admin.service;

import com.pbl5.admin.dto.admin.ShopDto;

import java.util.List;

public interface ShopService {


    List<ShopDto> getAllShops(int page, int pageSize, String sortField, String sortOrder, String searchText);

    void updateEnabled(Integer id, boolean enabled);
}

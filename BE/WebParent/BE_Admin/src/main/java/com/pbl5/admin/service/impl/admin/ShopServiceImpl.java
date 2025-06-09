package com.pbl5.admin.service.impl.admin;

import com.pbl5.admin.dto.admin.ShopDto;
import com.pbl5.admin.repository.shop.ShopRepository;
import com.pbl5.admin.service.admin.ShopService;
import com.pbl5.common.entity.Shop;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShopServiceImpl implements ShopService {
    @Autowired
    private ShopRepository shopRepository;

    @Override
    public List<ShopDto> getAllShops(int page, int pageSize, String sortField, String sortOrder, String searchText) {
        Pageable pageable = null;
        if (sortOrder.equals("ascend")) {
            pageable = PageRequest.of(page-1, pageSize, Sort.by(sortField).ascending());
        } else {
            pageable = PageRequest.of(page-1, pageSize, Sort.by(sortField).descending());
        }

        if(searchText != null && !searchText.isEmpty()) {
            return shopRepository.findAll(pageable, searchText).getContent().stream().map(shop -> {
                ShopDto shopDto = new ShopDto();
                shopDto.clone(shop);
                return shopDto;
            }).toList();
        }
        shopRepository.findAll(pageable).getContent().forEach(s -> {;
            System.out.println(s.getName());
        });
        return shopRepository.findAll(pageable).getContent().stream().map(shop -> {
            ShopDto shopDto = new ShopDto();
            shopDto.clone(shop);
            return shopDto;
        }).toList();
    }

    @Override
    public void updateEnabled(Integer id, boolean enabled) {
        Shop shop = shopRepository.findById(id).orElseThrow(() -> new RuntimeException("Shop not found"));
        shop.setEnabled(enabled);
        shopRepository.save(shop);
    }
}

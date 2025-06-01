package com.pbl5.admin.service.impl.admin;

import com.pbl5.admin.dto.admin.ShopRevenueDto;
import com.pbl5.admin.dto.admin.ShopStatisticDto;
import com.pbl5.admin.dto.admin.ShopStatisticProjection;
import com.pbl5.admin.repository.OrderRepository;
import com.pbl5.admin.service.ShopStatisticService;
import com.pbl5.common.entity.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShopStatisticServiceImpl implements ShopStatisticService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public List<ShopRevenueDto> getShopRevenue(String date) {
        return orderRepository.findShopRevenueByDate(date);
    }

    @Override
    public List<ShopStatisticDto> getShopStatistic(String date) {
        List<ShopStatisticProjection> projections = orderRepository.findStatisticOrderByDate(date);

        return projections.stream()
                .map(p -> new ShopStatisticDto(
                        p.getId(),
                        p.getShopName(),
                        p.getTotalOrders(),
                        p.getCompletedOrders(),
                        p.getCanceledOrders(),
                        p.getFailedOrders(),
                        p.getRevenue(),
                        p.getCompletionRate()
                ))
                .collect(Collectors.toList());
    }
}

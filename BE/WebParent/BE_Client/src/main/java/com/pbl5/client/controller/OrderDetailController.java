package com.pbl5.client.controller;

import com.pbl5.client.common.Constants;
import com.pbl5.client.dto.order_detail.OrderDetailDto;
import com.pbl5.client.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order")
@CrossOrigin(origins = Constants.FE_URL)
public class OrderDetailController {
    private final OrderDetailService orderDetailService;

    public OrderDetailController(OrderDetailService orderDetailService) {
        this.orderDetailService = orderDetailService;
    }

    @GetMapping
    public ResponseEntity<OrderDetailDto> getOrderDetailByOrderIdAndCustomerId(@RequestParam(name = "orderId") Integer orderId
    , @RequestParam(name = "customerId") Integer customerId) {
        OrderDetailDto orderDetailDto = orderDetailService.getOrderDetailDtoByCustomerId(orderId,customerId);
        if (orderDetailDto != null) {
            return ResponseEntity.ok(orderDetailDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}

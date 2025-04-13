package com.pbl5.client.service;

import com.pbl5.client.dto.checkout.ShippingRequestDto;
import com.pbl5.client.dto.checkout.ShippingRespondDto;
import com.pbl5.client.exception.ProductNotFoundException;

import java.util.List;

public interface ShippingRequestService {
    List<ShippingRequestDto> getShippingRequestList(int customerId, List<Integer> cartIds ) throws ProductNotFoundException;
    ShippingRespondDto getShippingRespond(ShippingRequestDto shippingRequestDto);
    List<ShippingRespondDto> getShippingRespondList(List<ShippingRequestDto> shippingRequestDtoList);
}

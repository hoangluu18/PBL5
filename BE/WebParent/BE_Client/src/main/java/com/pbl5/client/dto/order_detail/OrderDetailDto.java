package com.pbl5.client.dto.order_detail;

import com.pbl5.client.dto.CartProductDto;
import com.pbl5.client.dto.OrderDto;
import com.pbl5.client.dto.checkout.AddressInfoDto;
import com.pbl5.client.dto.checkout.ShippingRequestDto;
import com.pbl5.client.dto.checkout.ShippingRespondDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.jaxb.SpringDataJaxb;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderDetailDto {
    private List<CartProductDto> cartProductDtoList;
    private OrderDto orderDto;
}



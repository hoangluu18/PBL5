package com.pbl5.client.dto.checkout;

import com.pbl5.client.dto.CartProductDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CheckoutInfoDto {

    private AddressInfoDto addressInfoDto;
    private List<CartProductDto> cartProductDtoList;
    private List<ShippingRequestDto> shippingRequestDtoList;
    private List<ShippingRespondDto> shippingRespondDtoList;

}

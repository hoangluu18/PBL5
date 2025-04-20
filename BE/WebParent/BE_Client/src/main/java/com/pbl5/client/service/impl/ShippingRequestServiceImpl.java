package com.pbl5.client.service.impl;

import com.pbl5.client.dto.CartProductDto;
import com.pbl5.client.dto.checkout.AddressInfoDto;
import com.pbl5.client.dto.checkout.ShippingRequestDto;
import com.pbl5.client.dto.checkout.ShippingRespondDto;
import com.pbl5.client.exception.ProductNotFoundException;
import com.pbl5.client.repository.ShopRepository;
import com.pbl5.client.service.AddressInfoService;
import com.pbl5.client.service.CartService;
import com.pbl5.client.service.ProductService;
import com.pbl5.client.service.ShippingRequestService;
import com.pbl5.common.entity.Shop;
import com.pbl5.common.entity.product.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

import java.util.*;
import java.util.stream.Collectors;

import static java.lang.Math.max;

@Service
public class ShippingRequestServiceImpl implements ShippingRequestService {
    @Autowired
    private CartService cartService;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private AddressInfoService addressInfoService;

    @Autowired
    private ProductService productService;

    private List<ShippingRequestDto> result;
    @Override
    public List<ShippingRequestDto> getShippingRequestList(int customerId ,List<Integer> cartIds) throws ProductNotFoundException {
        List<CartProductDto> cartProductDtoList = cartService.getCartByCustomerIdAndProductIdList(customerId,cartIds);

        // Get customer's address
        String address = addressInfoService.findCityById(customerId);
        String customerAddress = address != null ? address : "";

        // Group cart products by shopId
        Map<Integer, List<CartProductDto>> groupedByShop = cartProductDtoList.stream()
                .collect(Collectors.groupingBy(CartProductDto::getShopId));

        result = new ArrayList<>();

        // Process each shop group
        for (Map.Entry<Integer, List<CartProductDto>> entry : groupedByShop.entrySet()) {
            int shopId = entry.getKey();
            List<CartProductDto> shopProducts = entry.getValue();
            System.out.println("shop");
            System.out.println(shopProducts);
            // Get shop city
            Optional<Shop> shopOptional = shopRepository.findById(shopId);
            String shopCity = shopOptional.map(Shop::getCity).orElse("");

            // Create shipping request
            ShippingRequestDto requestDto = new ShippingRequestDto();
            requestDto.setShopId(shopId);

            // Sum dimensions and weight for all products from the same shop
            float totalWeight = 0f, totalHeight = 0f, totalWidth = 0f, totalLength = 0f;

            for (CartProductDto product : shopProducts) {
                // In a real application, you would get these values from the product
                // This is just a placeholder - replace with actual dimension calculation
                System.out.println("Id: " + product.getProductId());
                Product productEntity = productService.getByProductId(product.getProductId());
                float productWeight = productEntity.getWeight();
                float productHeight = productEntity.getHeight();
                float productWidth = productEntity.getWidth();
                float productLength = productEntity.getLength();

                totalWeight += productWeight;
                totalHeight = max(productHeight, totalHeight);
                totalWidth = max(productWidth, totalWidth);
                totalLength = max(productLength, totalLength);
            }

            requestDto.setWeight(totalWeight);
            requestDto.setHeight(totalHeight);
            requestDto.setWidth(totalWidth);
            requestDto.setLength(totalLength);

            requestDto.setDeliveryPoint(shopCity);
            requestDto.setReceivingPoint(customerAddress);

            result.add(requestDto);
        }

        return result;
    }

    @Override
    public ShippingRespondDto getShippingRespond(ShippingRequestDto shippingRequestDto) {
        String URL = "https://pmshoanghot-calculate-shipping.hf.space/calculate_shipping";
        RestTemplate restTemplate = new RestTemplate();

        // Tạo đối tượng body request
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("weight", (float)shippingRequestDto.getWeight()); // Ép kiểu về integer
        requestBody.put("height", (float)shippingRequestDto.getHeight());
        requestBody.put("width", (float)shippingRequestDto.getWidth());
        requestBody.put("length", (float)shippingRequestDto.getLength());
        requestBody.put("diem_giao_hang", shippingRequestDto.getDeliveryPoint());
        requestBody.put("diem_nhan_hang", shippingRequestDto.getReceivingPoint());

        // Hiển thị log để debug
        System.out.println("Sending request: " + requestBody);

        // Cấu hình header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(URL, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                System.out.println("API response: " + responseBody);

                ShippingRespondDto shippingRespond = new ShippingRespondDto();
                shippingRespond.setShopId(shippingRequestDto.getShopId());
                shippingRespond.setShippingCompany((String) responseBody.get("shipping_company"));
                shippingRespond.setShippingCost(Float.parseFloat(responseBody.get("shipping_cost").toString()));
                shippingRespond.setEstimatedDeliveryTime((String) responseBody.get("delivery_time"));
                return shippingRespond;
            }
        } catch (HttpClientErrorException e) {
            System.err.println("API Error: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            System.err.println("General Error: " + e.getMessage());
        }

        return null;
    }

    @Override
    public List<ShippingRespondDto> getShippingRespondList(List<ShippingRequestDto> shippingRequestDtoList) {
        return List.of();
    }

    @Override
    public ShippingRequestDto getShippingRequestForProduct(Integer customerId, Product product, Integer quantity, AddressInfoDto addressInfoDto) {
        ShippingRequestDto shippingRequestDto = new ShippingRequestDto();
        shippingRequestDto.setShopId(product.getShop().getId());
        shippingRequestDto.setWeight(product.getWeight());
        shippingRequestDto.setHeight(product.getHeight());
        shippingRequestDto.setWidth(product.getWidth());
        shippingRequestDto.setLength(product.getLength());
        shippingRequestDto.setDeliveryPoint(product.getShop().getCity());
        shippingRequestDto.setReceivingPoint(addressInfoDto.getCity());
        return shippingRequestDto;
    }

//    private int shopId;
//    private float weight;
//    private float height;
//    private float width;
//    private float length;
//    private String deliveryPoint;
//    private String receivingPoint;
}

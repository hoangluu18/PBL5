package com.pbl5.client.service.impl;

import com.pbl5.client.dto.CartProductDto;
import com.pbl5.client.dto.CustomerDto;
import com.pbl5.client.dto.checkout.AddressInfoDto;
import com.pbl5.client.dto.checkout.CheckoutInfoDto;
import com.pbl5.client.dto.checkout.ShippingRequestDto;
import com.pbl5.client.dto.checkout.ShippingRespondDto;
import com.pbl5.client.exception.ProductNotFoundException;
import com.pbl5.client.service.*;
import com.pbl5.common.entity.Customer;
import com.pbl5.common.entity.Order;
import com.pbl5.common.entity.OrderDetail;
import com.pbl5.common.entity.OrderTrack;
import com.pbl5.common.entity.product.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private final AddressInfoService addressInfoService;
    private final CartService cartService;
    private final ShippingRequestService shippingRequestService;
    private final OrderDetailService orderDetailService;
    private final OrderTrackService orderTrackService;
    private final ProductService productService;
    private final OrderService orderService;
    private final CustomerService customerService;
    @Autowired
    public CheckoutServiceImpl(AddressInfoService addressInfoService, CartService cartService, ShippingRequestService shippingRequestService, OrderDetailService orderDetailService, OrderTrackService orderTrackService, ProductService productService, OrderService orderService, CustomerService customerService) {
        this.addressInfoService = addressInfoService;
        this.cartService = cartService;
        this.shippingRequestService = shippingRequestService;
        this.orderDetailService = orderDetailService;
        this.orderTrackService = orderTrackService;
        this.productService = productService;
        this.orderService = orderService;
        this.customerService = customerService;
    }

    @Override
    public CheckoutInfoDto getCheckoutInfo(int customerId) throws ProductNotFoundException {
        //set up tam thoi voi customerId = 1
        //find data addressInfo
        AddressInfoDto addressInfoDto = addressInfoService.fineByAddressDefault(customerId);
        //find data cartProduct
        List<CartProductDto> cartProductDtoList = cartService.getCartByCustomerId(customerId);

        //find data shippingRequest
        List<ShippingRequestDto> shippingRequestList = shippingRequestService.getShippingRequestList(customerId);

        //find data shippingRespond

        List<ShippingRespondDto> shippingRespondList = new ArrayList<>();

        for(ShippingRequestDto shippingRequest : shippingRequestList) {
            System.out.println("respond: " + shippingRequest);
            ShippingRespondDto shippingRespond = shippingRequestService.getShippingRespond(shippingRequest);
            if(shippingRespond != null) {
                shippingRespondList.add(shippingRespond);
            }
        }

        //update data checkoutInfo
        CheckoutInfoDto checkoutInfoDto = new CheckoutInfoDto();
        checkoutInfoDto.setAddressInfoDto(addressInfoDto);
        checkoutInfoDto.setCartProductDtoList(cartProductDtoList);
        checkoutInfoDto.setShippingRequestDtoList(shippingRequestList);
        checkoutInfoDto.setShippingRespondDtoList(shippingRespondList);
        if(addressInfoDto == null || cartProductDtoList.isEmpty() || shippingRequestList.isEmpty() || shippingRespondList.isEmpty()) {
            return null;
        }
        return checkoutInfoDto;
    }

    @Override
    public List<Order> getOrderList(CheckoutInfoDto checkoutInfoDto, CustomerDto customerDto) {
        List<Order> orders = new ArrayList<>();
        Date orderTime = new Date(); // Current time

        // Group cart items by shopId
        Map<Integer, List<CartProductDto>> shopProducts = checkoutInfoDto.getCartProductDtoList().stream()
                .collect(Collectors.groupingBy(CartProductDto::getShopId));

        // Process each shop's order
        for (Map.Entry<Integer, List<CartProductDto>> entry : shopProducts.entrySet()) {
            int shopId = entry.getKey();
            List<CartProductDto> products = entry.getValue();

            // Find shipping info for this shop
            ShippingRespondDto shipping = checkoutInfoDto.getShippingRespondDtoList().stream()
                    .filter(s -> s.getShopId() == shopId)
                    .findFirst()
                    .orElse(null);

            if (shipping == null) continue;

            // Calculate product cost (sum of all items' price × quantity)
            float productCost = 0f;
            for (CartProductDto product : products) {
                productCost += product.getLastPrice() * product.getQuantity();
            }

            float shippingCost = shipping.getShippingCost();
            float subtotal = productCost;
            float total = productCost + shippingCost;

            // Parse delivery time to calculate delivery date and days
            String deliveryTime = shipping.getEstimatedDeliveryTime();
            int deliveryDays = parseDeliveryDays(deliveryTime);

            // Create new order
            Order order = new Order();
            order.setFirstName(customerDto.getFirstName());
            order.setLastName(customerDto.getLastName());
            order.setPhoneNumber(checkoutInfoDto.getAddressInfoDto().getPhone());
            order.setAddressLine(checkoutInfoDto.getAddressInfoDto().getAddress());
            order.setOrderTime(orderTime);

            // Extract city from address (simplified for now)
            String[] addressParts = checkoutInfoDto.getAddressInfoDto().getAddress().split(", ");
            String city = addressParts.length > 0 ? addressParts[addressParts.length - 1] : "";
            order.setCity(city);

            // Set delivery information
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(orderTime);
            calendar.add(Calendar.DAY_OF_MONTH, deliveryDays);
            order.setDeliverDate(calendar.getTime());
            order.setDeliverDays(deliveryDays);

            // Set financial information
            order.setProductCost(productCost);
            order.setShippingCost(shippingCost);
            order.setSubtotal(subtotal);
            order.setTotal(total);

            // Set default values
            order.setOrderStatus(Order.OrderStatus.NEW);
            order.setPaymentMethod(Order.PaymentMethod.COD);

            // Set customer and shop IDs
            order.setCustomerId(customerDto.getId());
            order.setShopId(shopId);

            orders.add(order);
        }

        return orders;
    }

    @Override
    public int parseDeliveryDays(String deliveryTime) {
        // Parse delivery time string (e.g., "96h-120h") to get max days
        int days = Integer.parseInt(deliveryTime);
        days = days / 24; // Convert hours to days
        return days;
    }


    @Override
    public CheckoutInfoDto saveCheckoutInfo(int customerId) throws ProductNotFoundException {
        // Find data for the specific customer
        AddressInfoDto addressInfoDto = addressInfoService.fineByAddressDefault(customerId);
        List<CartProductDto> cartProductDtoList = cartService.getCartByCustomerId(customerId);
        List<ShippingRequestDto> shippingRequestList = shippingRequestService.getShippingRequestList(customerId);

        // Find shipping responses
        List<ShippingRespondDto> shippingRespondList = new ArrayList<>();
        for(ShippingRequestDto shippingRequest : shippingRequestList) {
            ShippingRespondDto shippingRespond = shippingRequestService.getShippingRespond(shippingRequest);
            if(shippingRespond != null) {
                shippingRespondList.add(shippingRespond);
            }
        }

        // Build checkout info
        CheckoutInfoDto checkoutInfoDto = new CheckoutInfoDto();
        checkoutInfoDto.setAddressInfoDto(addressInfoDto);
        checkoutInfoDto.setCartProductDtoList(cartProductDtoList);
        checkoutInfoDto.setShippingRequestDtoList(shippingRequestList);
        checkoutInfoDto.setShippingRespondDtoList(shippingRespondList);

        if(addressInfoDto == null || cartProductDtoList.isEmpty() || shippingRequestList.isEmpty() || shippingRespondList.isEmpty()) {
            return null;
        }

        try {
            // Get customer information
            Customer customer = customerService.fineByCustomerId(customerId);
            CustomerDto customerDto = new CustomerDto();
            customerDto.setId(customer.getId());
            customerDto.setFirstName(customer.getFirstName());
            customerDto.setLastName(customer.getLastName());
            customerDto.setEmail(customer.getEmail());
            customerDto.setPhoneNumber(customer.getPhoneNumber());
            customerDto.setAvatar(customer.getAvatar());

            // Create and save orders
            List<Order> orders = getOrderList(checkoutInfoDto, customerDto);
            if(orders.isEmpty()) {
                return null;
            }

            // Save orders first to get IDs
            if(orderService.saveAll(orders)) {
                System.out.println("Orders saved successfully");

                // Group cart items by shopId
                Map<Integer, List<CartProductDto>> shopProducts = checkoutInfoDto.getCartProductDtoList().stream()
                        .collect(Collectors.groupingBy(CartProductDto::getShopId));

                // Process each order to save details and tracks
                for (Order order : orders) {
                    int shopId = order.getShopId();
                    List<CartProductDto> products = shopProducts.get(shopId);

                    if (products != null) {
                        // Save order details for each product
                        for (CartProductDto productDto : products) {
                            OrderDetail orderDetail = new OrderDetail();
                            orderDetail.setOrder(order); // Use existing saved order

                            // Get Product entity from repository
                            Product product = productService.getByProductId(productDto.getProductId());
                            orderDetail.setProduct(product);

                            orderDetail.setProductVariantDetail(productDto.getAttributes());
                            orderDetail.setQuantity(productDto.getQuantity());
                            orderDetail.setProductCost((float) (productDto.getLastPrice() * productDto.getQuantity()));

                            // Calculate proportional shipping cost
                            float shippingCost = order.getShippingCost() / products.size();
                            orderDetail.setShippingCost(shippingCost);

                            orderDetail.setSubtotal(orderDetail.getProductCost() + orderDetail.getShippingCost());
                            orderDetail.setUnitPrice((float) productDto.getLastPrice());

                            orderDetailService.save(orderDetail);
                        }

                        // Create order track
                        OrderTrack orderTrack = new OrderTrack();
                        orderTrack.setOrder(order); // Use existing saved order
                        orderTrack.setStatus(OrderTrack.OrderStatus.NEW);
                        orderTrack.setUpdatedTime(new Date());
                        orderTrack.setNotes("Order created and awaiting processing.");
                        orderTrackService.save(orderTrack);
                    }
                }

                // Clear the customer's cart
                cartService.deleteAllCartItemsByCustomerId(customerId);

                return checkoutInfoDto;
            } else {
                System.out.println("Failed to save orders");
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

package com.pbl5.client.controller;

import com.pbl5.client.common.Constants;
import com.pbl5.client.dto.CartProductDto;
import com.pbl5.client.dto.CustomerDto;
import com.pbl5.client.dto.checkout.AddressInfoDto;
import com.pbl5.client.dto.checkout.CheckoutInfoDto;
import com.pbl5.client.dto.checkout.ShippingRequestDto;
import com.pbl5.client.dto.checkout.ShippingRespondDto;
import com.pbl5.client.exception.ProductNotFoundException;
import com.pbl5.client.repository.OrderRepository;
import com.pbl5.client.service.*;
import com.pbl5.common.entity.*;
import com.pbl5.common.entity.product.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = Constants.FE_URL)
public class CheckoutController {
    @Autowired
    private AddressInfoService addressInfoService;

    @Autowired
    private CartService cartService;

    @Autowired
    private ShippingRequestService shippingRequestService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailService orderDetailService;

    @Autowired
    private OrderTrackService orderTrackService;

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<CheckoutInfoDto> getCheckoutInfo() throws ProductNotFoundException {
        //set up tam thoi voi customerId = 1
        //find data addressInfo
        AddressInfoDto addressInfoDto = addressInfoService.fineByAddressDefault(1);
        //find data cartProduct
        List<CartProductDto> cartProductDtoList = cartService.getCartByCustomerId(1);

        //find data shippingRequest
        List<ShippingRequestDto> shippingRequestList = shippingRequestService.getShippingRequestList(1);

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
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(checkoutInfoDto);
    }

    public List<Order> getOrderList(CheckoutInfoDto checkoutInfoDto, CustomerDto customerDto) throws ProductNotFoundException {
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

    private int parseDeliveryDays(String deliveryTime) {
        // Parse delivery time string (e.g., "96h-120h") to get max days
        int days = Integer.parseInt(deliveryTime);
        days = days / 24; // Convert hours to days
        return days;
    }

    public void saveOrderDetailsAndTracks(CheckoutInfoDto checkoutInfoDto, Integer customerId) throws ProductNotFoundException {
        Date orderTime = new Date();

        // Group cart items by shopId
        Map<Integer, List<CartProductDto>> shopProducts = checkoutInfoDto.getCartProductDtoList().stream()
                .collect(Collectors.groupingBy(CartProductDto::getShopId));

        for (Map.Entry<Integer, List<CartProductDto>> entry : shopProducts.entrySet()) {
            int shopId = entry.getKey();
            List<CartProductDto> products = entry.getValue();

            ShippingRespondDto shipping = checkoutInfoDto.getShippingRespondDtoList().stream()
                    .filter(s -> s.getShopId() == shopId)
                    .findFirst()
                    .orElse(null);

            if (shipping == null) continue;

            // Calculate costs
            float productCost = 0f;
            for (CartProductDto product : products) {
                productCost += product.getLastPrice() * product.getQuantity();
            }

            float shippingCost = shipping.getShippingCost();
            float subtotal = productCost;
            float total = productCost + shippingCost;

            // Parse delivery time
            String deliveryTime = shipping.getEstimatedDeliveryTime();
            int deliveryDays = parseDeliveryDays(deliveryTime);

            // Create order
            Order order = new Order();
            order.setFirstName(checkoutInfoDto.getAddressInfoDto().getName());
            order.setLastName("");
            order.setPhoneNumber(checkoutInfoDto.getAddressInfoDto().getPhone());
            order.setAddressLine(checkoutInfoDto.getAddressInfoDto().getAddress());
            order.setOrderTime(orderTime);

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
            order.setOrderStatus(Order.OrderStatus.NEW);
            order.setPaymentMethod(Order.PaymentMethod.COD);
            order.setCustomerId(1);
            order.setShopId(shopId);

            // Save the order FIRST to get an ID
            Order savedOrder = orderRepository.save(order);

            // Now use the saved order for relationships
            for (CartProductDto productDto : products) {
                OrderDetail orderDetail = new OrderDetail();
                orderDetail.setOrder(savedOrder);

                // Get Product entity from repository
                Product product = productService.getByProductId(productDto.getProductId());

                orderDetail.setProduct(product);

                orderDetail.setProductVariantDetail(productDto.getAttributes());
                orderDetail.setQuantity(productDto.getQuantity());
                orderDetail.setProductCost((float) (productDto.getLastPrice() * productDto.getQuantity()));
                orderDetail.setShippingCost(shippingCost / products.size());
                orderDetail.setSubtotal(orderDetail.getProductCost() + orderDetail.getShippingCost());
                orderDetail.setUnitPrice((float) productDto.getLastPrice());

                orderDetailService.save(orderDetail);
            }

            // Create order track with the saved order
            OrderTrack orderTrack = new OrderTrack();
            orderTrack.setOrder(savedOrder);
            orderTrack.setStatus(OrderTrack.OrderStatus.NEW);
            orderTrack.setUpdatedTime(new Date());
            orderTrack.setNotes("Order created and awaiting processing.");
            orderTrackService.save(orderTrack);
        }
    }

    @PostMapping("/save")
    public ResponseEntity<CheckoutInfoDto> saveCheckoutInfo(@RequestParam Integer customerId) throws ProductNotFoundException {
        if (customerId == null) {
            return ResponseEntity.badRequest().body(null);
        }

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
            return ResponseEntity.notFound().build();
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
            orderRepository.saveAll(orders);

            // Save order details and tracks (update the method call to pass customerId)
            saveOrderDetailsAndTracks(checkoutInfoDto, customerId);

            // Clear the customer's cart
            cartService.deleteAllCartItemsByCustomerId(customerId);

            return ResponseEntity.ok(checkoutInfoDto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
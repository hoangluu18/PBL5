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
    private final ProductVariantService productVariantService;
    @Autowired
    public CheckoutServiceImpl(AddressInfoService addressInfoService, CartService cartService, ShippingRequestService shippingRequestService, OrderDetailService orderDetailService, OrderTrackService orderTrackService, ProductService productService, OrderService orderService, CustomerService customerService, ProductVariantService productVariantService) {
        this.addressInfoService = addressInfoService;
        this.cartService = cartService;
        this.shippingRequestService = shippingRequestService;
        this.orderDetailService = orderDetailService;
        this.orderTrackService = orderTrackService;
        this.productService = productService;
        this.orderService = orderService;
        this.customerService = customerService;
        this.productVariantService = productVariantService;
    }

    @Override
    public CheckoutInfoDto getCheckoutInfo(int customerId,List<Integer> cartIds) throws ProductNotFoundException {
        //set up tam thoi voi customerId = 1
        //find data addressInfo
        AddressInfoDto addressInfoDto = addressInfoService.fineByAddressDefault(customerId);
        //find data cartProduct
        List<CartProductDto> cartProductDtoList = cartService.getCartByCustomerId(customerId);

        //find data shippingRequest
        List<ShippingRequestDto> shippingRequestList = shippingRequestService.getShippingRequestList(customerId,cartIds);

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
            float subtotal = 0f;
            for (CartProductDto product : products) {
                productCost += product.getOriginalPrice() * product.getQuantity();
                subtotal += product.getLastPrice() * product.getQuantity();
            }

            float shippingCost = shipping.getShippingCost();

            float total = subtotal + shippingCost;

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
    public CheckoutInfoDto saveCheckoutInfo(int customerId,List<Integer> cartIds) throws ProductNotFoundException {
        // Find data for the specific customer
        AddressInfoDto addressInfoDto = addressInfoService.fineByAddressDefault(customerId);
        List<CartProductDto> cartProductDtoList = cartService.getCartByCustomerIdAndProductIdList(customerId, cartIds);
        List<ShippingRequestDto> shippingRequestList = shippingRequestService.getShippingRequestList(customerId,cartIds);
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
                            orderDetail.setProductCost(product.getCost());

                            // Calculate proportional shipping cost
                            float shippingCost = order.getShippingCost() / products.size();
                            orderDetail.setShippingCost(shippingCost);

                            orderDetail.setSubtotal((float) (productDto.getLastPrice() * productDto.getQuantity()));
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
                cartService.deleteCartItemByCustomerIdAndCartId(customerId,cartIds);
                //reduce quantity product
                for(CartProductDto productDto : cartProductDtoList){
                    // Trừ số lượng sản phẩm
                    String attributes = productDto.getAttributes();
                    if (attributes != null && !attributes.isEmpty()) {
                        if (attributes.contains(",")) {
                            productVariantService.reduceVariantQuantityForMultipleAttributes(
                                    productDto.getProductId(),
                                    productDto.getQuantity(),
                                    attributes
                            );
                        } else {
                            productVariantService.reduceVariantQuantityForSingleAttribute(
                                    productDto.getProductId(),
                                    productDto.getQuantity(),
                                    attributes
                            );
                        }
                    }
                }
                return checkoutInfoDto;
            } else {
                System.out.println("Failed to save orders");
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        //reduce quantity product

    }

    @Override
    public CheckoutInfoDto getCheckoutInfoForSelectedProducts(int customerId, List<Integer> cartIds) throws ProductNotFoundException {
        //set up tam thoi voi customerId = 1
        //find data addressInfo
        AddressInfoDto addressInfoDto = addressInfoService.fineByAddressDefault(customerId);
        //find data cartProduct
        List<CartProductDto> cartProductDtoList = cartService.getCartByCustomerIdAndProductIdList(customerId, cartIds);

        //find data shippingRequest
        List<ShippingRequestDto> shippingRequestList = shippingRequestService.getShippingRequestList(customerId,cartIds);

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
    public CheckoutInfoDto getCheckoutInfoForBuyNow(Integer customerId, Integer productId, Integer quantity, String productDetail) throws ProductNotFoundException {
        AddressInfoDto addressInfoDto = addressInfoService.fineByAddressDefault(customerId);
        Product product = productService.getByProductId(productId);
        if(product == null){
            throw new ProductNotFoundException("Product not found with id: " + productId);
        }
        double originalPrice = product.getCost();
        double discountPercent = product.getDiscountPercent();
        double lastPrice = product.getPrice() * (1 - discountPercent / 100);

        CartProductDto cartProductDto = new CartProductDto(
                null,
                productId,
                product.getName(),
                product.getAlias(),
                quantity,
                originalPrice,
                discountPercent,
                lastPrice,
                product.getMainImage(),
                product.getShop().getName(),
                product.getShop().getId(),
                productDetail,
                true
        );

        // Tạo danh sách chỉ chứa sản phẩm này
        List<CartProductDto> cartProductDtoList = Collections.singletonList(cartProductDto);

        // Lấy thông tin vận chuyển
        ShippingRequestDto shippingRequest = shippingRequestService.getShippingRequestForProduct(
                customerId, product, quantity, addressInfoDto
        );

        List<ShippingRequestDto> shippingRequestList = Collections.singletonList(shippingRequest);
        ShippingRespondDto shippingRespond = shippingRequestService.getShippingRespond(shippingRequest);
        List<ShippingRespondDto> shippingRespondList = Collections.singletonList(shippingRespond);

        CheckoutInfoDto checkoutInfoDto = new CheckoutInfoDto();
        checkoutInfoDto.setAddressInfoDto(addressInfoDto);
        checkoutInfoDto.setCartProductDtoList(cartProductDtoList);
        checkoutInfoDto.setShippingRequestDtoList(shippingRequestList);
        checkoutInfoDto.setShippingRespondDtoList(shippingRespondList);

        return checkoutInfoDto;
    }

    @Override
    public boolean saveCheckoutInfoBuyNow(int customerId, CheckoutInfoDto checkoutInfoDto) {
        try {
            // Get customer information
            Customer customer = customerService.fineByCustomerId(customerId);
            if (customer == null) {
                return false;
            }

            CustomerDto customerDto = new CustomerDto();
            customerDto.setId(customer.getId());
            customerDto.setFirstName(customer.getFirstName());
            customerDto.setLastName(customer.getLastName());
            customerDto.setEmail(customer.getEmail());
            customerDto.setPhoneNumber(customer.getPhoneNumber());
            customerDto.setAvatar(customer.getAvatar());

            // Kiểm tra thông tin checkout
            if (checkoutInfoDto == null) {
                return false;
            }

            // Các bước xử lý giống như đối với saveCheckoutInfo thông thường
            // Tạo đơn hàng từ thông tin checkout
            List<Order> orders = getOrderList(checkoutInfoDto, customerDto);
            if (orders.isEmpty()) {
                return false;
            }

            // Lưu đơn hàng
            boolean ordersSaved = orderService.saveAll(orders);
            if (!ordersSaved) {
                return false;
            }

            // Xử lý chi tiết đơn hàng và theo dõi đơn hàng
            for (Order order : orders) {
                int shopId = order.getShopId();

                // Tìm danh sách sản phẩm cho shop này
                List<CartProductDto> products = checkoutInfoDto.getCartProductDtoList().stream()
                        .filter(p -> p.getShopId() == shopId)
                        .collect(Collectors.toList());

                if (!products.isEmpty()) {
                    // Lưu chi tiết đơn hàng
                    for (CartProductDto productDto : products) {
                        OrderDetail orderDetail = new OrderDetail();
                        orderDetail.setOrder(order);

                        // Lấy thông tin sản phẩm
                        Product product = productService.getByProductId(productDto.getProductId());
                        orderDetail.setProduct(product);

                        orderDetail.setProductVariantDetail(productDto.getAttributes());
                        orderDetail.setQuantity(productDto.getQuantity());
                        orderDetail.setProductCost(product.getCost());

                        // Tính toán chi phí vận chuyển tỷ lệ
                        float shippingCost = order.getShippingCost() / products.size();
                        orderDetail.setShippingCost(shippingCost);

                        orderDetail.setSubtotal((float) (productDto.getLastPrice()*productDto.getQuantity()));
                        orderDetail.setUnitPrice((float) productDto.getLastPrice());

                        orderDetailService.save(orderDetail);
                    }

                    // Tạo theo dõi đơn hàng
                    OrderTrack orderTrack = new OrderTrack();
                    orderTrack.setOrder(order);
                    orderTrack.setStatus(OrderTrack.OrderStatus.NEW);
                    orderTrack.setUpdatedTime(new Date());
                    orderTrack.setNotes("Đơn hàng mua ngay đã được tạo và đang chờ xử lý.");
                    orderTrackService.save(orderTrack);
                    //reduce quantity product
                }

                //reduce quantity product

                for(CartProductDto productDto : products){
                    // Trừ số lượng sản phẩm
                    String attributes = productDto.getAttributes();
                    if (attributes != null && !attributes.isEmpty()) {
                        if (attributes.contains(",")) {
                            productVariantService.reduceVariantQuantityForMultipleAttributes(
                                    productDto.getProductId(),
                                    productDto.getQuantity(),
                                    attributes
                            );
                        } else {
                            productVariantService.reduceVariantQuantityForSingleAttribute(
                                    productDto.getProductId(),
                                    productDto.getQuantity(),
                                    attributes
                            );
                        }
                    }
                }
            }

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}

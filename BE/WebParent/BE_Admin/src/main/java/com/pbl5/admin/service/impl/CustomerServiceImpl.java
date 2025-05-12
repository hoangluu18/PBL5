package com.pbl5.admin.service.impl;

import com.pbl5.admin.dto.CustomerDto;
import com.pbl5.admin.repository.CustomerRepository;
import com.pbl5.admin.repository.OrderRepository;
import com.pbl5.admin.service.CustomerService;
import com.pbl5.common.entity.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {


    private final CustomerRepository customerRepository;

    private final OrderRepository orderRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository, OrderRepository orderRepository) {
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public List<CustomerDto> findAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        List<CustomerDto> customerDtos = new ArrayList<>();

        for (Customer customer : customers) {
            // Tính tổng chi tiêu của khách hàng từ bảng orders
            Double totalSpending = orderRepository.calculateTotalSpendingByCustomerId(customer.getId());
            CustomerDto customerDto = new CustomerDto(customer.getId(), customer.getFullName(), customer.getPhoneNumber(), totalSpending, customer.getEmail(), customer.getAvatar());
            customerDtos.add(customerDto);
        }

        return customerDtos;
    }

    @Override
    public CustomerDto findCustomerById(Integer id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với id: " + id));

        Double totalSpending = orderRepository.calculateTotalSpendingByCustomerId(customer.getId());

        return new CustomerDto(
                customer.getId(),
                customer.getFullName(),
                customer.getPhoneNumber(),
                totalSpending,
                customer.getEmail(),
                customer.getAvatar()
        );
    }
}

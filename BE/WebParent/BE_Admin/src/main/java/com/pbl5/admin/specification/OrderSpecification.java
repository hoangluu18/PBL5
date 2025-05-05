package com.pbl5.admin.specification;

import com.pbl5.admin.dto.orders.OrderSearchDto;
import com.pbl5.common.entity.Order;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Specification class for dynamic order queries using Spring Data JPA Specifications
 */
public class OrderSpecification {

    /**
     * Create a specification for searching orders with flexible parameters
     *
     * @param searchDto The search criteria
     * @return Specification for the search query
     */
    public static Specification<Order> searchByCriteria(OrderSearchDto searchDto) {
        return (Root<Order> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            // Add conditions for each non-empty parameter

            if (StringUtils.hasText(searchDto.getOrderTimeFrom())) {
                LocalDate fromDate = LocalDate.parse(searchDto.getOrderTimeFrom(), formatter);
                predicates.add(cb.greaterThanOrEqualTo(root.get("orderTime"), fromDate.atStartOfDay()));
            }

            if (StringUtils.hasText(searchDto.getOrderTimeTo())) {
                LocalDate toDate = LocalDate.parse(searchDto.getOrderTimeTo(), formatter);
                predicates.add(cb.lessThanOrEqualTo(root.get("orderTime"), toDate.atTime(23, 59, 59)));
            }

            if (searchDto.getOrderStatus() != null && searchDto.getOrderStatus().length > 0) {
                predicates.add(root.get("orderStatus").in(Arrays.asList(searchDto.getOrderStatus())));
            }

            if (searchDto.getPaymentMethod() != null && searchDto.getPaymentMethod().length>0) {
                predicates.add(root.get("paymentMethod").in(Arrays.asList(searchDto.getPaymentMethod())));
            }

            if (StringUtils.hasText(searchDto.getDeliveryDateFrom())) {
                LocalDate fromDate = LocalDate.parse(searchDto.getDeliveryDateFrom(), formatter);
                predicates.add(cb.greaterThanOrEqualTo(root.get("deliverDate"), fromDate.atStartOfDay()));
            }

            if (StringUtils.hasText(searchDto.getDeliveryDateTo())) {
                LocalDate toDate = LocalDate.parse(searchDto.getDeliveryDateTo(), formatter);
                predicates.add(cb.lessThanOrEqualTo(root.get("deliverDate"), toDate.atTime(23, 59, 59)));
            }

            if (StringUtils.hasText(searchDto.getCity())) {
                predicates.add(cb.like(root.get("city"), "%" + searchDto.getCity() + "%"));
            }
            if(searchDto.getShopId() > 0){
                predicates.add(cb.equal(root.get("shopId"), searchDto.getShopId()));
            }
            if(StringUtils.hasText(searchDto.getKeyword())){
                predicates.add(cb.equal(root.get("id"),  Integer.parseInt(searchDto.getKeyword())));
            }
            query.orderBy(cb.desc(root.get("orderTime")));
            // Combine predicates with AND operator
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
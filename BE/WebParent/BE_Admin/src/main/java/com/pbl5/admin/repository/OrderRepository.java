package com.pbl5.admin.repository;

import com.pbl5.admin.dto.admin.ShopRevenueDto;
import com.pbl5.admin.dto.admin.ShopStatisticProjection;
import com.pbl5.admin.dto.dashboard.RevenueReportDto;
import com.pbl5.admin.dto.dashboard.TopProductReportDto;
import com.pbl5.common.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer>, JpaSpecificationExecutor<Order> {

    @Query("SELECT o FROM Order o WHERE o.shopId = :shopId ORDER BY o.orderTime DESC LiMIT 15")
    List<Order> findRecentOrders(int shopId);

    @Query(nativeQuery = true,value = "SELECT get_revenue_change(:dayOffset, :shopId)")
    Float getRevenueChange(@Param("dayOffset") int dayOffset, @Param("shopId") int shopId);

    @Query(nativeQuery = true, value = "SELECT SUM(od.quantity) " +
            "FROM orders o JOIN order_details od ON o.id = od.order_id " +
            "WHERE o.shop_id = :shopId AND DATE(o.order_time) = CURRENT_DATE() AND o.order_status != 'RETURN_REQUESTED' ")
    Integer getTotalProductSoldToday(int shopId);

    @Query(nativeQuery = true, value = "SELECT * FROM orders WHERE DATE(order_time) = CURRENT_DATE() AND shop_id = :shopId")
    List<Order> findByToday(int shopId);

    @Query(nativeQuery = true, value = "WITH RECURSIVE dates AS ( \n" +
            "    SELECT CAST(:startDate AS DATE) AS date_value \n" +
            "    UNION ALL \n" +
            "    SELECT date_value + INTERVAL 1 DAY \n" +
            "    FROM dates \n" +
            "    WHERE date_value + INTERVAL 1 DAY <= CAST(:endDate AS DATE) \n" +
            ") \n" +
            "SELECT DATE_FORMAT(d.date_value, '%Y-%m-%d') AS IDENTIFIER, \n" +
            "       COALESCE(SUM(o.total), 0) AS GROSS_REVENUE, \n" +
            "       COALESCE(COUNT(o.id), 0) AS TOTAL_ORDER, \n" +
            "       COALESCE(SUM(o.subtotal - o.product_cost), 0) AS NET_PROFIT \n" +
            "FROM dates d \n" +
            "LEFT JOIN orders o ON d.date_value = DATE(o.order_time) \n" +
            "                   AND o.shop_id = :shopId \n" +
            "GROUP BY d.date_value \n" +
            "ORDER BY d.date_value ASC;\n")
    List<RevenueReportDto> findReportByDateRange(@Param("startDate") String startDate, @Param("endDate") String endDate, @Param("shopId") int shopId);

    @Query(nativeQuery = true, value = "WITH RECURSIVE months AS (\n" +
            "    SELECT DATE_FORMAT(CURRENT_DATE() - INTERVAL :months MONTH, '%Y-%m-01') AS month_value\n" +
            "    UNION ALL\n" +
            "    SELECT DATE_ADD(month_value, INTERVAL 1 MONTH)\n" +
            "    FROM months\n" +
            "    WHERE DATE_ADD(month_value, INTERVAL 1 MONTH) <= DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')\n" +
            ")\n" +
            "SELECT \n" +
            "    DATE_FORMAT(d.month_value, '%Y-%m') AS IDENTIFIER,\n" +
            "    COALESCE(SUM(o.total), 0) AS GROSS_REVENUE, \n" +
            "    COALESCE(COUNT(o.id),0) AS TOTAL_ORDER, \n" +
            "    COALESCE(SUM(o.subtotal - o.product_cost), 0) AS NET_PROFIT\n" +
            "FROM months d\n" +
            "LEFT JOIN orders o \n" +
            "    ON DATE_FORMAT(o.order_time, '%Y-%m') = DATE_FORMAT(d.month_value, '%Y-%m') AND o.shop_id = :shopId\n" +
            "GROUP BY IDENTIFIER\n" +
            "ORDER BY IDENTIFIER ASC;")
    List<RevenueReportDto> findReportByXMonths(@Param("months") int months, @Param("shopId") int shopId);

    @Query(nativeQuery = true, value = "SELECT \n" +
            "  DATE_FORMAT(o.order_time, '%Y-%m') AS IDENTIFIER,\n" +
            "  p.name AS PRODUCT_NAME,\n" +
            "  COALESCE(SUM(od.quantity),0) AS TOTAL_AMOUNT,\n" +
            "  COALESCE(SUM(od.subtotal),0) AS TOTAL_REVENUE\n" +
            "FROM orders o\n" +
            "JOIN order_details od ON o.id = od.order_id\n" +
            "JOIN products p ON p.id = od.product_id\n" +
            "WHERE o.order_status = 'DELIVERED'\n" +
            "  AND DATE_FORMAT(o.order_time, '%Y-%m') = :month\n" +
            "  AND o.shop_id = :shopId\n" +
            "GROUP BY DATE_FORMAT(o.order_time, '%Y-%m'), od.product_id, p.name\n" +
            "ORDER BY TOTAL_AMOUNT DESC\n" +
            "LIMIT 10;")
    List<TopProductReportDto> findTopProductsByMonth(@Param("month") String month, @Param("shopId") int shopId);
     @Query("SELECT SUM(o.total) FROM Order o WHERE o.customerId = :customerId AND o.orderStatus = 'DELIVERED'")
    Double calculateTotalSpendingByCustomerId(@Param("customerId") Integer customerId);

     @Query(nativeQuery = true,
     value = "SELECT s.name shopName, COALESCE(SUM(o.total),0) revenue FROM orders o\n" +
             "JOIN shops s ON s.id = o.shop_id\n" +
             " WHERE o.order_status = 'DELIVERED' AND DATE_FORMAT(o.order_time, '%Y-%m') = :date\n" +
             "GROUP BY o.shop_id;")
     List<ShopRevenueDto> findShopRevenueByDate(@Param("date") String date);

    @Query(nativeQuery = true,
            value = "SELECT \n" +
                    "    sub.shop_id AS id,\n" +
                    "    sub.shopName,\n" +
                    "    CAST(sub.totalOrders AS DOUBLE) AS totalOrders,\n" +
                    "    sub.completedOrders,\n" +
                    "    sub.canceledOrders,\n" +
                    "    sub.failedOrders,\n" +
                    "    sub.revenue,\n" +
                    "    CASE WHEN sub.totalOrders = 0 THEN 0 ELSE (sub.completedOrders / sub.totalOrders * 100) END AS completionRate\n" +
                    "FROM (\n" +
                    "    SELECT \n" +
                    "        o.shop_id,\n" +
                    "        s.name AS shopName,\n" +
                    "        COUNT(o.id) AS totalOrders,\n" +
                    "        SUM(CASE WHEN o.order_status = 'DELIVERED' THEN 1 ELSE 0 END) AS completedOrders,\n" +
                    "        SUM(CASE WHEN o.order_status = 'RETURNED' THEN 1 ELSE 0 END) AS canceledOrders,\n" +
                    "        SUM(CASE WHEN o.order_status = 'CANCELED' THEN 1 ELSE 0 END) AS failedOrders,\n" +
                    "        COALESCE(SUM(o.total), 0) AS revenue\n" +
                    "    FROM \n" +
                    "        orders o \n" +
                    "    JOIN \n" +
                    "        shops s ON o.shop_id = s.id\n" +
                    "    WHERE \n" +
                    "        DATE_FORMAT(o.order_time, '%Y-%m') = :date\n" +
                    "    GROUP BY \n" +
                    "        o.shop_id, s.name\n" +
                    ") AS sub;")
    List<ShopStatisticProjection> findStatisticOrderByDate(@Param("date") String date);
}

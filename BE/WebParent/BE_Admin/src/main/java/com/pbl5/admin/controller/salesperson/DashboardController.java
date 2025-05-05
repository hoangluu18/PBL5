package com.pbl5.admin.controller.salesperson;

import com.pbl5.admin.dto.ResponseDto;
import com.pbl5.admin.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Calendar;
import java.util.Locale;

@RestController
@RequestMapping("/api/salesperson")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private OrderService orderService;

    @RequestMapping("/today-statistic")
    public ResponseEntity<ResponseDto> getRevenueChange(int shopId) {
        ResponseDto response = new ResponseDto();
        try {
            response.setData(orderService.getTodayStatistic(shopId));
            response.setMessage("Doanh thu hôm nay");
            response.setStatusCode(200);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.setMessage("Failed to get revenue change");
            response.setStatusCode(500);
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/statistic/{value}")
    public ResponseEntity<ResponseDto> getReportByXDaysAndXMonths(@PathVariable("value") String value, int shopId) {
        ResponseDto response = new ResponseDto();
        LocalDate endDate = LocalDate.now();
        switch (value) {
            case "1_week_ago":
                response.setData(orderService.getReportByDateRange(endDate.minusDays(7).toString(), endDate.toString(), shopId));
                response.setMessage("Doanh thu 7 ngày gần nhất");
                break;
            case "1_month_ago":
                response.setData(orderService.getReportByDateRange(endDate.minusDays(30).toString(), endDate.toString(), shopId));
                response.setMessage("Doanh thu 30 ngày gần nhất");
                break;
            case "6_months_ago":
                response.setData(orderService.getReportByXMonths(6, shopId));
                response.setMessage("Doanh thu 6 tháng gần nhất");
                break;
            case "1_year_ago":
                response.setData(orderService.getReportByXMonths(12, shopId));
                response.setMessage("Doanh thu 1 năm gần nhất");
                break;
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/statistic/{startDate}/{endDate}")
    public ResponseEntity<ResponseDto> getReportByDateRange(@PathVariable("startDate") String startDate, @PathVariable("endDate") String endDate, int shopId) {
        ResponseDto response = new ResponseDto();
        try {
            response.setData(orderService.getReportByDateRange(startDate, endDate, shopId));
            response.setMessage("Doanh thu từ " + startDate + " đến " + endDate);
            response.setStatusCode(200);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.setMessage("Failed to get revenue change");
            response.setStatusCode(500);
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/statistic/top-product/{date}")
    public ResponseEntity<ResponseDto> getTopProductReport(@PathVariable("date") String date, int shopId) {
        ResponseDto response = new ResponseDto();
        try {
            response.setData(orderService.getTopProductReport(date, shopId));
            response.setMessage("Top sản phẩm bán chạy nhất tháng " + date);
            response.setStatusCode(200);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.setMessage(e.getMessage());
            response.setStatusCode(500);
            return ResponseEntity.status(500).body(response);
        }
    }



}

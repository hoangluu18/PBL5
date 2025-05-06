package com.pbl5.admin.controller.salesperson;

import com.itextpdf.text.DocumentException;
import com.pbl5.admin.dto.ResponseDto;
import com.pbl5.admin.dto.orders.OrderDetailDto;
import com.pbl5.admin.dto.orders.OrderSearchDto;
import com.pbl5.admin.dto.orders.OrderStatusDto;
import com.pbl5.admin.service.OrderService;
import com.pbl5.admin.utils.ExportToPdf;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;


@RestController
@RequestMapping("/api/salesperson")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/order/update")
    public ResponseEntity<?> saveOrder(@RequestBody OrderStatusDto orderRequestDto) {
        ResponseDto response = new ResponseDto();
        orderService.updateOrder(orderRequestDto);
        response.setStatusCode(200);
        response.setMessage("Save order successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/orders/search")
    public ResponseEntity<ResponseDto> searchOrders(OrderSearchDto searchDto) {
        ResponseDto response = new ResponseDto();
        response.setStatusCode(200);
        response.setMessage("Search orders successfully");
        response.setData(orderService.searchOrders(searchDto));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/order-detail/{orderId}")
    public ResponseEntity<ResponseDto> getOrderDetail(@PathVariable("orderId") int orderId) {
        ResponseDto response = new ResponseDto();
        response.setStatusCode(200);
        response.setMessage("Get order detail successfully");
        response.setData(orderService.getOrderExtraInfo(orderId));
        return ResponseEntity.ok(response);
    }
    @PostMapping("/order/export-pdf")
    public void exportOrderPdf(HttpServletResponse response, @RequestBody OrderDetailDto detailDto) throws DocumentException, IOException {
        byte[] pdfBytes = ExportToPdf.exportOrderToPdf(detailDto);

        response.setContentType("application/pdf");
        response.setCharacterEncoding("UTF-8");

        // Include order ID in filename
        String fileName = "order_" + detailDto.getOrderId() + ".pdf";
        String encodedFileName = java.net.URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");

        // Set header with encoded filename for better UTF-8 support
        response.setHeader("Content-Disposition", "attachment; filename=" + encodedFileName);
        response.setContentLength(pdfBytes.length);

        response.getOutputStream().write(pdfBytes);
        response.getOutputStream().flush();
    }

    @PostMapping("/orders/export-pdf-batch")
    public void exportOrdersPdfBatch(HttpServletResponse response, @RequestBody List<Integer> orderIds)
            throws DocumentException, IOException {
        if (orderIds == null || orderIds.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("No order IDs provided");
            return;
        }

        // Create ZIP output stream
        response.setContentType("application/zip");
        response.setCharacterEncoding("UTF-8");
        String fileName = "orders_export.zip";
        response.setHeader("Content-Disposition", "attachment; filename=" + fileName);

        try (ZipOutputStream zipOut = new ZipOutputStream(response.getOutputStream())) {
            for (Integer orderId : orderIds) {
                try {
                    OrderDetailDto orderDetail = orderService.getOrderDetails(orderId);
                    if (orderDetail != null) {
                        byte[] pdfBytes = ExportToPdf.exportOrderToPdf(orderDetail);

                        // Create ZIP entry for this PDF
                        ZipEntry zipEntry = new ZipEntry("order_" + orderId + ".pdf");
                        zipOut.putNextEntry(zipEntry);
                        zipOut.write(pdfBytes);
                        zipOut.closeEntry();
                    }
                } catch (Exception e) {
                    // Log error but continue with other orders
                    System.err.println("Error exporting order #" + orderId + ": " + e.getMessage());
                }
            }

            zipOut.finish();
        }
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<ResponseDto> getRecentOrders(int shopId) {
        ResponseDto response = new ResponseDto();
        try {
            response.setData(orderService.getRecentOrders(shopId));
            response.setMessage("Danh sách đơn hàng gần đây");
            response.setStatusCode(200);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // hoặc log.error("Error:", e);
            response.setMessage("Failed to get recent orders");
            response.setStatusCode(500);
            return ResponseEntity.status(500).body(response);
        }
    }
}

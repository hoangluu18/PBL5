package com.pbl5.admin.utils;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.pbl5.admin.dto.orders.OrderDetailDto;
import com.pbl5.admin.dto.orders.OrderProductsDto;

import java.io.ByteArrayOutputStream;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

public class ExportToPdf {

    public static byte[] exportOrderToPdf(OrderDetailDto detailDto) throws DocumentException {

        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            // Setup Vietnamese font support
            BaseFont baseFont = BaseFont.createFont("Webparent/BE_Admin/src/main/resources/fonts/arial.ttf",
                    BaseFont.IDENTITY_H, BaseFont.EMBEDDED);

            Font titleFont = new Font(baseFont, 18, Font.BOLD);
            Font boldFont = new Font(baseFont, 12, Font.BOLD);
            Font normalFont = new Font(baseFont, 12);
            Font headerFont = new Font(baseFont, 11, Font.BOLD);

            // Setup Vietnamese currency format
            NumberFormat currencyFormat = NumberFormat.getNumberInstance(new Locale("vi", "VN"));
            currencyFormat.setMaximumFractionDigits(0);

            // Add title
            Paragraph title = new Paragraph("HÓA ĐƠN ĐẶT HÀNG", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            // Add order information
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);

            // Left column - Order details
            PdfPCell leftCell = new PdfPCell();
            leftCell.setBorder(Rectangle.NO_BORDER);

            Paragraph orderInfo = new Paragraph();
            orderInfo.add(new Chunk("Mã đơn hàng: ", boldFont));
            orderInfo.add(new Chunk(detailDto.getOrderId().toString(), normalFont));
            orderInfo.add(Chunk.NEWLINE);

            orderInfo.add(new Chunk("Ngày đặt hàng: ", boldFont));
            orderInfo.add(new Chunk(detailDto.getOrderTime(), normalFont));
            orderInfo.add(Chunk.NEWLINE);

            orderInfo.add(new Chunk("Ngày giao hàng: ", boldFont));
            orderInfo.add(new Chunk(detailDto.getDeliveryDate(), normalFont));
            orderInfo.add(Chunk.NEWLINE);

            orderInfo.add(new Chunk("Trạng thái: ", boldFont));
            orderInfo.add(new Chunk(detailDto.getOrderStatus(), normalFont));
            orderInfo.add(Chunk.NEWLINE);

            orderInfo.add(new Chunk("Phương thức thanh toán: ", boldFont));
            orderInfo.add(new Chunk(detailDto.getPaymentMethod(), normalFont));

            if (detailDto.getNote() != null && !detailDto.getNote().isEmpty()) {
                orderInfo.add(Chunk.NEWLINE);
                orderInfo.add(new Chunk("Ghi chú: ", boldFont));
                orderInfo.add(new Chunk(detailDto.getNote(), normalFont));
            }

            leftCell.addElement(orderInfo);
            infoTable.addCell(leftCell);

            // Right column - Customer details
            PdfPCell rightCell = new PdfPCell();
            rightCell.setBorder(Rectangle.NO_BORDER);

            Paragraph customerInfo = new Paragraph();
            customerInfo.add(new Chunk("Khách hàng: ", boldFont));
            customerInfo.add(new Chunk(detailDto.getCustomerName(), normalFont));
            customerInfo.add(Chunk.NEWLINE);

            customerInfo.add(new Chunk("Điện thoại: ", boldFont));
            customerInfo.add(new Chunk(detailDto.getPhoneNumber(), normalFont));
            customerInfo.add(Chunk.NEWLINE);

            customerInfo.add(new Chunk("Địa chỉ giao hàng: ", boldFont));
            customerInfo.add(new Chunk(detailDto.getAddress(), normalFont));

            rightCell.addElement(customerInfo);
            infoTable.addCell(rightCell);

            document.add(infoTable);
            document.add(new Paragraph(" "));

            // Products table
            PdfPTable productsTable = new PdfPTable(6);
            productsTable.setWidthPercentage(100);
            productsTable.setWidths(new float[]{1f, 3f, 1.5f, 1f, 1.5f, 1.5f});

            // Table header
            BaseColor headerBg = new BaseColor(220, 220, 220);

            PdfPCell headerCell = new PdfPCell(new Phrase("ID", headerFont));
            headerCell.setBackgroundColor(headerBg);
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            headerCell.setPadding(5);
            productsTable.addCell(headerCell);

            headerCell = new PdfPCell(new Phrase("Sản phẩm", headerFont));
            headerCell.setBackgroundColor(headerBg);
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            headerCell.setPadding(5);
            productsTable.addCell(headerCell);

            headerCell = new PdfPCell(new Phrase("Đơn giá", headerFont));
            headerCell.setBackgroundColor(headerBg);
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            headerCell.setPadding(5);
            productsTable.addCell(headerCell);

            headerCell = new PdfPCell(new Phrase("SL", headerFont));
            headerCell.setBackgroundColor(headerBg);
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            headerCell.setPadding(5);
            productsTable.addCell(headerCell);

            headerCell = new PdfPCell(new Phrase("Giảm giá", headerFont));
            headerCell.setBackgroundColor(headerBg);
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            headerCell.setPadding(5);
            productsTable.addCell(headerCell);

            headerCell = new PdfPCell(new Phrase("Thành tiền", headerFont));
            headerCell.setBackgroundColor(headerBg);
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            headerCell.setPadding(5);
            productsTable.addCell(headerCell);

            // Table data
            for (OrderProductsDto item : detailDto.getOrderProducts()) {
                PdfPCell cell = new PdfPCell(new Phrase(item.getProductId().toString(), normalFont));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                productsTable.addCell(cell);

                cell = new PdfPCell(new Phrase(item.getProductName(), normalFont));
                productsTable.addCell(cell);

                cell = new PdfPCell(new Phrase(currencyFormat.format(item.getProductPrice()) + " đ", normalFont));
                cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                productsTable.addCell(cell);

                cell = new PdfPCell(new Phrase(String.valueOf(item.getQuantity()), normalFont));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                productsTable.addCell(cell);

                cell = new PdfPCell(new Phrase(currencyFormat.format(item.getDiscount()) + " đ", normalFont));
                cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                productsTable.addCell(cell);

                cell = new PdfPCell(new Phrase(currencyFormat.format(item.getTotalPrice()) + " đ", normalFont));
                cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                productsTable.addCell(cell);
            }

            document.add(productsTable);
            document.add(new Paragraph(" "));

            // Order summary
            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(40);
            summaryTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
            summaryTable.setWidths(new float[]{1.5f, 1f});

            PdfPCell cell = new PdfPCell(new Phrase("Tạm tính:", boldFont));
            cell.setBorder(Rectangle.NO_BORDER);
            cell.setHorizontalAlignment(Element.ALIGN_LEFT);
            summaryTable.addCell(cell);

            cell = new PdfPCell(new Phrase(currencyFormat.format(detailDto.getSubtotal()) + " đ", normalFont));
            cell.setBorder(Rectangle.NO_BORDER);
            cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            summaryTable.addCell(cell);

            cell = new PdfPCell(new Phrase("Phí vận chuyển:", boldFont));
            cell.setBorder(Rectangle.NO_BORDER);
            cell.setHorizontalAlignment(Element.ALIGN_LEFT);
            summaryTable.addCell(cell);

            cell = new PdfPCell(new Phrase(currencyFormat.format(detailDto.getShippingFee()) + " đ", normalFont));
            cell.setBorder(Rectangle.NO_BORDER);
            cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            summaryTable.addCell(cell);

            cell = new PdfPCell(new Phrase("Tổng cộng (" + detailDto.getTotalQuantity() + " sản phẩm):", boldFont));
            cell.setBorder(Rectangle.NO_BORDER);
            cell.setHorizontalAlignment(Element.ALIGN_LEFT);
            summaryTable.addCell(cell);

            Font totalFont = new Font(baseFont, 12, Font.BOLD);
            cell = new PdfPCell(new Phrase(currencyFormat.format(detailDto.getTotal()) + " đ", totalFont));
            cell.setBorder(Rectangle.NO_BORDER);
            cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            summaryTable.addCell(cell);

            document.add(summaryTable);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new DocumentException("Error generating PDF: " + e.getMessage());
        }
    }
}
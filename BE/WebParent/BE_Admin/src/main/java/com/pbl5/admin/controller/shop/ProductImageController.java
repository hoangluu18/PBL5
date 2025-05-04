package com.pbl5.admin.controller.shop;

import com.pbl5.admin.service.aws.S3StorageService;
import com.pbl5.admin.service.shop.ProductService;
import com.pbl5.admin.service.shop.ProductVariantService;
import com.pbl5.common.entity.product.Product;
import com.pbl5.common.entity.product.ProductVariant;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductImageController {


    private final ProductService productService;
    private final S3StorageService s3StorageService;
    private final ProductVariantService productVariantService;

    public ProductImageController(ProductService productService, S3StorageService s3StorageService, ProductVariantService productVariantService) {
        this.productService = productService;
        this.s3StorageService = s3StorageService;
        this.productVariantService = productVariantService;
    }


    @PostMapping("/image-upload")
    public ResponseEntity<Map<String, String>> uploadEditorImage(@RequestParam("file") MultipartFile file) {
        try {
            // Xử lý lưu file
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = fileName.substring(fileName.lastIndexOf("."));
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

            // Đường dẫn lưu trữ file
            String uploadDir = "products/editor/";
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Lưu file
            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Trả về URL của ảnh đã upload
            String fileUrl = "/products/editor/" + uniqueFileName;
            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", fileUrl);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Endpoint mới để upload ảnh chính cho sản phẩm
    @PostMapping("/{productId}/image")
    public ResponseEntity<?> uploadProductMainImage(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file) {
        try {
            // Kiểm tra sản phẩm tồn tại
            Optional<Product> productOpt = productService.findById(productId);
            if (!productOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Product product = productOpt.get();

            // Xóa ảnh cũ nếu có
            if (product.getMainImage() != null && !product.getMainImage().isEmpty()) {
                s3StorageService.deleteFile(product.getMainImage());
                System.out.println("Xóa ảnh sản phẩm cũ: " + product.getMainImage());
            }

            // Upload ảnh mới vào thư mục products/main_image
            String imageUrl = s3StorageService.uploadFile(file, "products/main_image");

            // Cập nhật URL ảnh trong database
            product.setMainImage(imageUrl);
            productService.save(product);

            // Trả về URL của ảnh mới
            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", imageUrl);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

//variant image
@PostMapping("/{productId}/variant-image")
public ResponseEntity<Map<String, String>> uploadVariantImage(
        @PathVariable Long productId,
        @RequestParam("file") MultipartFile file,
        @RequestParam("variantId") Long variantId) {

    try {
        // Kiểm tra sản phẩm tồn tại
        Product product = productService.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));

        // Tìm variant để cập nhật
//        ProductVariant variant = product.getVariants().stream()
//                .filter(v -> v.getId().equals(variantId))
//                .findFirst()
//                .orElseThrow(() -> new EntityNotFoundException("Variant not found with id: " + variantId));
        ProductVariant variant = productVariantService.getProductVariantById(variantId);
        // Validate file
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Upload ảnh mới vào thư mục products/variant_image (quan trọng: đúng tiền tố này)
        String imageUrl = s3StorageService.uploadFile(file, "products/variant_image");

        // Cập nhật photo cho variant
        variant.setPhoto(imageUrl);
        productService.save(product);

        // Trả về URL của ảnh mới
        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", imageUrl);
        return ResponseEntity.ok(response);

    } catch (EntityNotFoundException e) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    } catch (Exception e) {
        e.printStackTrace();
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}

}
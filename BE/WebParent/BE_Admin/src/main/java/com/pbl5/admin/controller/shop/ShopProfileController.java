package com.pbl5.admin.controller.shop;

import com.pbl5.admin.dto.ResponseDto;
import com.pbl5.admin.dto.shop.ShopProfileDto;
import com.pbl5.admin.service.aws.S3StorageService;
import com.pbl5.admin.service.shop.ShopProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/shop/profile")
@CrossOrigin(origins = "*")
public class ShopProfileController {

    @Autowired
    private ShopProfileService shopProfileService;

    @Autowired
    private S3StorageService awsS3Service;

    @GetMapping
    public ResponseEntity<ResponseDto> getShopProfile(@RequestParam int userId) {
        ResponseDto response = new ResponseDto();
        try {
            ShopProfileDto shopProfile = shopProfileService.getShopProfileByUserId(userId);
            response.setData(shopProfile);
            response.setMessage("Shop profile retrieved successfully");
            response.setStatusCode(200);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.setMessage("Failed to retrieve shop profile: " + e.getMessage());
            response.setStatusCode(500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping
    public ResponseEntity<ResponseDto> updateShopProfile(@RequestBody ShopProfileDto shopProfileDto) {
        ResponseDto response = new ResponseDto();
        try {
            ShopProfileDto updatedProfile = shopProfileService.updateShopProfile(shopProfileDto);
            response.setData(updatedProfile);
            response.setMessage("Shop profile updated successfully");
            response.setStatusCode(200);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.setMessage("Failed to update shop profile: " + e.getMessage());
            response.setStatusCode(500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping(value = "/upload-photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseDto> uploadShopPhoto(@RequestParam("file") MultipartFile file, @RequestParam int shopId) {
        ResponseDto response = new ResponseDto();
        try {
            String fileUrl = awsS3Service.uploadFile(file, "shop_images");
            shopProfileService.updateShopPhoto(shopId, fileUrl);

            response.setData(fileUrl);
            response.setMessage("Shop photo uploaded successfully");
            response.setStatusCode(200);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.setMessage("Failed to upload shop photo: " + e.getMessage());
            response.setStatusCode(500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/get-shop-id")
    public ResponseEntity<ResponseDto> getShopIdByUserId(@RequestParam int userId) {
        ResponseDto response = new ResponseDto();
        try {
            int shopId = shopProfileService.getShopIdByUserId(userId);
            response.setData(shopId);
            response.setMessage("Shop ID retrieved successfully");
            response.setStatusCode(200);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.setMessage("Failed to retrieve shop ID: " + e.getMessage());
            response.setStatusCode(500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
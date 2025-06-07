package com.pbl5.admin.controller.shop;

import com.amazonaws.util.IOUtils;
import com.pbl5.admin.dto.ResponseDto;
import com.pbl5.admin.service.aws.S3StorageService;
import com.pbl5.admin.service.shop.BrandService;
import com.pbl5.client.dto.BrandDto;
import com.pbl5.common.entity.Brand;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;
    @Autowired
    private S3StorageService s3StorageService;

    @GetMapping
    public ResponseEntity<List<BrandDto>> getAllBrands() {
        List<BrandDto> brands = brandService.getAllBrands();
        return ResponseEntity.ok(brands);
    }

    @GetMapping("/by-category/{categoryId}")
    public ResponseEntity<List<BrandDto>> getBrandsByCategory(@PathVariable Long categoryId) {
        List<BrandDto> brands = brandService.getBrandsByCategory(categoryId);
        return ResponseEntity.ok(brands);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBrandById(@PathVariable Integer id) {
        brandService.deleteBrandById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseDto> updateBrand(@PathVariable Integer id, @RequestBody BrandDto brandDto) {
        try {
            brandDto.setId(id);
            Brand brand = brandService.updateBrand(brandDto);
            ResponseDto responseDto = new ResponseDto();
            responseDto.setMessage("Brand updated successfully");
            responseDto.setData(brand);
            responseDto.setStatusCode(200);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            ResponseDto responseDto = new ResponseDto();
            responseDto.setMessage("Failed to update brand: " + e.getMessage());
            responseDto.setStatusCode(500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }


    @PostMapping
    public ResponseEntity<ResponseDto> saveBrand(@RequestBody BrandDto brandDto) throws IOException {
        {
            try {

                Brand brand = brandService.saveBrand(brandDto);

                ResponseDto responseDto = new ResponseDto();
                responseDto.setMessage("Brand created successfully");
                responseDto.setData(brand);
                responseDto.setStatusCode(201);
                return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
            } catch (Exception e) {
                ResponseDto responseDto = new ResponseDto();
                responseDto.setMessage("Failed to create brand: " + e.getMessage());
                responseDto.setStatusCode(500);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
            }
        }

    }
}

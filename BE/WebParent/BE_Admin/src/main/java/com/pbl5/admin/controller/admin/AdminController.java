package com.pbl5.admin.controller.admin;

import com.pbl5.admin.dto.ResponseDto;
import com.pbl5.admin.dto.admin.CategoryDto;
import com.pbl5.admin.service.ShopService;
import com.pbl5.admin.service.ShopStatisticService;
import com.pbl5.admin.service.shop.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private ShopStatisticService shopStatisticService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ShopService shopService;

    @GetMapping("/shop-revenue")
    public ResponseEntity<ResponseDto> getShopRevenue(@RequestParam("date") String date) {
        ResponseDto responseDto = new ResponseDto();
        try {
            responseDto.setData(shopStatisticService.getShopRevenue(date));
            responseDto.setMessage("Get shop revenue successfully");
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            responseDto.setMessage(e.getMessage());
            return ResponseEntity.status(500).body(responseDto);
        }
    }

    @GetMapping("/shop-statistic")
    public ResponseEntity<ResponseDto> getShopStatistic(@RequestParam("date") String date) {
        ResponseDto responseDto = new ResponseDto();
        try {
            responseDto.setData(shopStatisticService.getShopStatistic(date));
            responseDto.setMessage("Get shop statistic successfully");
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            responseDto.setMessage(e.getMessage());
            return ResponseEntity.status(500).body(responseDto);
        }
    }

    @GetMapping("/shop-list")
    public ResponseEntity<ResponseDto> getShopList(int page, int pageSize, String sortField, String sortOrder, String searchText) {
        ResponseDto responseDto = new ResponseDto();
        try {
            responseDto.setData(shopService.getAllShops(page, pageSize, sortField, sortOrder, searchText));
            responseDto.setMessage("Get shop list successfully");
            responseDto.setStatusCode(200);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            responseDto.setMessage(e.getMessage());
            return ResponseEntity.status(500).body(responseDto);
        }
    }

    @PutMapping("/shop/{id}/toggle-status")
    public void updateShopStatus(@PathVariable Integer id, @RequestParam boolean enabled) {
        shopService.updateEnabled(id, enabled);
    }

    @GetMapping("/categories")
    public ResponseEntity<ResponseDto> getAllCategories() {
        ResponseDto responseDto = new ResponseDto();
        try {
            responseDto.setData(categoryService.getAllAdminCategories());
            responseDto.setMessage("Get all categories successfully");
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            responseDto.setMessage(e.getMessage());
            return ResponseEntity.status(500).body(responseDto);
        }
    }

    @PostMapping("/categories")
    public ResponseEntity<ResponseDto> createCategory(@RequestBody com.pbl5.admin.dto.admin.CategoryDto categoryDto) {
        ResponseDto responseDto = new ResponseDto();
        try {
            CategoryDto category = categoryService.saveCategory(categoryDto);
            responseDto.setMessage("Create category successfully");
            responseDto.setData(category);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            responseDto.setMessage(e.getMessage());
            return ResponseEntity.status(500).body(responseDto);
        }
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ResponseDto> deleteCategory(@PathVariable Integer id) {
        ResponseDto responseDto = new ResponseDto();
        try {
            categoryService.deleteCategory(id);
            responseDto.setMessage("Delete category successfully");
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            responseDto.setMessage(e.getMessage());
            return ResponseEntity.status(500).body(responseDto);
        }
    }
}

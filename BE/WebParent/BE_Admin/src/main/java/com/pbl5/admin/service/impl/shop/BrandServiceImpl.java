package com.pbl5.admin.service.impl.shop;

import com.pbl5.admin.repository.shop.BrandRepository;
import com.pbl5.admin.repository.shop.CategoryRepository;
import com.pbl5.admin.service.aws.S3StorageService;
import com.pbl5.admin.service.shop.BrandService;
import com.pbl5.client.dto.BrandDto;

import com.pbl5.common.entity.Brand;
import com.pbl5.common.entity.Category;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final S3StorageService s3StorageService; // Assuming you have a service for S3 operations


    @Override
    public List<BrandDto> getAllBrands() {
        List<Brand> brands = brandRepository.findAll();
        return brands.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BrandDto> getBrandsByCategory(Long categoryId) {
        Category category = categoryRepository.findById(Math.toIntExact(categoryId))
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        return category.getBrands().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteBrandById(Integer id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Brand not found"));
        brandRepository.delete(brand);
    }

    @Override
    public Brand saveBrand(BrandDto brandDto) throws IOException {


        Brand brand = new Brand();
        brand.setName(brandDto.getName());
        brand.setLogo(brand.getLogo());
        return brandRepository.save(brand);

    }

    @Override
    public Brand updateBrand(BrandDto brandDto) {
        Brand brand = brandRepository.findById(brandDto.getId())
                .orElseThrow(() -> new EntityNotFoundException("Brand not found"));
        brand.setName(brandDto.getName());
        brand.setLogo(brandDto.getLogo());
        return brandRepository.save(brand);
    }

    private BrandDto convertToDto(Brand brand) {
        BrandDto dto = new BrandDto();
        dto.setId(brand.getId());
        dto.setName(brand.getName());
        dto.setLogo(brand.getLogo());
        return dto;
    }

    private MultipartFile convertStringToMultipartFile(String content, String filename, String contentType) throws IOException {
        // Convert the String content to a byte array
        byte[] contentBytes = content.getBytes();

        // Create a MockMultipartFile instance
        // Parameters: name, originalFilename, contentType, content
        MockMultipartFile multipartFile = new MockMultipartFile(
                "file", // Name of the parameter in the multipart form (can be anything descriptive)
                filename, // Original filename (e.g., "myFile.txt")
                contentType, // Content type (e.g., "text/plain")
                contentBytes // The byte array of the content
        );

        return multipartFile;
    }
}
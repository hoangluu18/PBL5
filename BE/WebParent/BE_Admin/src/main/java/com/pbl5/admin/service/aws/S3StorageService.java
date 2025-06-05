package com.pbl5.admin.service.aws;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3StorageService {

    private final AmazonS3 s3Client;

    @Value("${aws.bucketName}")
    private String bucketName;

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        // Kiểm tra file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File không được để trống");
        }

        // Kiểm tra kích thước (5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("Kích thước file không được vượt quá 5MB");
        }

        // Kiểm tra loại file
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Chỉ chấp nhận file hình ảnh");
        }

        // Tạo tên file duy nhất
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String uniqueFilename = folder + "/" + UUID.randomUUID().toString() + extension;

        // Tạo metadata
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        // Upload lên S3
        s3Client.putObject(
                new PutObjectRequest(bucketName, uniqueFilename, file.getInputStream(), metadata)
        );

        // Trả về URL công khai của file
        return s3Client.getUrl(bucketName, uniqueFilename).toString();
    }



    public void deleteFile(String fileUrl) {
        if (fileUrl != null && !fileUrl.isEmpty()) {
            try {
                // Phân tích URL để lấy key
                URL url = new URL(fileUrl);
                String path = url.getPath();

                // Loại bỏ dấu / đầu tiên nếu có
                String key = path.startsWith("/") ? path.substring(1) : path;

                System.out.println("Deleting file with key: " + key);

                s3Client.deleteObject(bucketName, key);
                System.out.println("File deleted successfully");
            } catch (Exception e) {
                System.err.println("Error deleting file: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null) {
            return "";
        }
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex == -1) {
            return "";
        }
        return filename.substring(lastDotIndex);
    }
}

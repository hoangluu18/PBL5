package com.pbl5.admin.service.impl.shop;

import com.pbl5.admin.dto.shop.*;
import com.pbl5.admin.repository.shop.BrandRepository;
import com.pbl5.admin.repository.shop.CategoryRepository;
import com.pbl5.admin.repository.shop.ProductRepository;
import com.pbl5.admin.repository.shop.ProductVariantRepository;
import com.pbl5.admin.service.shop.ProductService;
import com.pbl5.common.entity.Brand;
import com.pbl5.common.entity.Category;
import com.pbl5.common.entity.Shop;
import com.pbl5.common.entity.product.Product;
import com.pbl5.common.entity.product.ProductDetail;
import com.pbl5.common.entity.product.ProductVariant;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;
    private final ProductVariantRepository productVariantRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    @Override
    public Page<ProductDto> getAllProducts(int page, int size, String sortField, String sortDir) {
        // Map DTO field names to entity field names if needed
        if ("lastUpdated".equals(sortField)) {
            sortField = "updatedAt";
        }

        Sort sort = Sort.by(sortField);
        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> productsPage = productRepository.findAll(pageable);

        return productsPage.map(this::convertToDto);
    }

    @Override
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

        return convertToDto(product);
    }

    @Override
    public ProductDto createProduct(ProductDto productDto) {
        Product product = modelMapper.map(productDto, Product.class);
        Product savedProduct = productRepository.save(product);

        return convertToDto(savedProduct);
    }

    @Override
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

        modelMapper.map(productDto, existingProduct);
        Product updatedProduct = productRepository.save(existingProduct);

        return convertToDto(updatedProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Transactional
    @Override
    public ProductDetailDto updateProductDetail(Long id, ProductDetailDto productDetailDto) {
        Product existingProduct = productRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

        // Cập nhật thông tin cơ bản
        existingProduct.setName(productDetailDto.getName());
        existingProduct.setAlias(productDetailDto.getAlias());
        existingProduct.setPrice(productDetailDto.getPrice());
        existingProduct.setCost(productDetailDto.getCost());
        existingProduct.setMainImage(productDetailDto.getMainImage());
        existingProduct.setFullDescription(productDetailDto.getFullDescription());
        existingProduct.setEnabled(productDetailDto.isEnabled());

        // Xử lý cập nhật thông số kỹ thuật
        if (productDetailDto.getSpecifications() != null) {
            // Xóa tất cả thông số kỹ thuật cũ
            existingProduct.getProductDetails().clear();

            // Thêm thông số kỹ thuật mới
            for (ProductSpecificationDto specDto : productDetailDto.getSpecifications()) {
                ProductDetail detail = new ProductDetail();
                detail.setName(specDto.getName());
                detail.setValue(specDto.getValue());
                detail.setProduct(existingProduct);
                existingProduct.getProductDetails().add(detail);
            }
        }

        // Xử lý cập nhật biến thể sản phẩm
        if (productDetailDto.getVariantGroups() != null) {
            // Lưu product trước để có ID cho các biến thể mới
            Product savedProduct = productRepository.save(existingProduct);

            // QUAN TRỌNG: Xóa tất cả biến thể cũ thông qua collection để Hibernate xử lý orphan removal
            Set<ProductVariant> originalVariants = new HashSet<>(savedProduct.getVariants());
            savedProduct.getVariants().clear();
            savedProduct = productRepository.save(savedProduct);

            // Map để theo dõi ID cũ và ID mới của biến thể cha
            Map<Long, Long> oldToNewParentIds = new HashMap<>();

            // Tạo danh sách biến thể cha trước
            for (ProductVariantGroupDto groupDto : productDetailDto.getVariantGroups()) {
                for (ProductVariantDto variantDto : groupDto.getVariants()) {
                    if (variantDto.getParentId() == null) {
                        // Chỉ tạo biến thể cha
                        ProductVariant variant = new ProductVariant();
                        variant.setKey(groupDto.getName());
                        variant.setValue(variantDto.getValue());
                        variant.setQuantity(variantDto.getQuantity());
                        variant.setPhoto(variantDto.getPhoto());
                        variant.setProduct(savedProduct);
                        variant.setParentId(null);

                        // Lưu biến thể cha
                        ProductVariant savedVariant = productVariantRepository.save(variant);

                        // Thêm vào danh sách biến thể của sản phẩm
                        savedProduct.getVariants().add(savedVariant);

                        // Lưu ánh xạ từ ID cũ sang ID mới
                        if (variantDto.getId() != null) {
                            oldToNewParentIds.put(variantDto.getId(), Long.valueOf(savedVariant.getId()));
                        }
                    }
                }
            }

            // Lưu để cập nhật danh sách biến thể cha
            savedProduct = productRepository.save(savedProduct);

            // Sau đó tạo các biến thể con
            for (ProductVariantGroupDto groupDto : productDetailDto.getVariantGroups()) {
                for (ProductVariantDto variantDto : groupDto.getVariants()) {
                    if (variantDto.getParentId() != null) {
                        ProductVariant variant = new ProductVariant();
                        variant.setKey(groupDto.getName());
                        variant.setValue(variantDto.getValue());
                        variant.setQuantity(variantDto.getQuantity());
                        variant.setPhoto(variantDto.getPhoto());
                        variant.setProduct(savedProduct);

                        // Cập nhật parentId với ID mới của biến thể cha
                        Long parentId = oldToNewParentIds.get(variantDto.getParentId());
                        if (parentId != null) {
                            variant.setParentId(Math.toIntExact(parentId));
                        } else {
                            // Nếu không tìm thấy biến thể cha mới, bỏ qua biến thể này
                            continue;
                        }

                        // Lưu biến thể con
                        ProductVariant savedVariant = productVariantRepository.save(variant);

                        // Thêm vào danh sách biến thể của sản phẩm
                        savedProduct.getVariants().add(savedVariant);
                    }
                }
            }

            // Lưu lại sản phẩm với các biến thể mới
            productRepository.save(savedProduct);
        } else {
            // Nếu không có biến thể, chỉ cần lưu sản phẩm
            productRepository.save(existingProduct);
        }

        //brand
        if (productDetailDto.getBrandId() != null) {
            Brand brand = brandRepository.findById(Math.toIntExact(productDetailDto.getBrandId()))
                    .orElseThrow(() -> new EntityNotFoundException("Brand not found"));
            existingProduct.setBrand(brand);
        } else {
            existingProduct.setBrand(null);
        }

        //category

        if (productDetailDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(Math.toIntExact(productDetailDto.getCategoryId()))
                    .orElseThrow(() -> new EntityNotFoundException("Category not found"));
            existingProduct.setCategory(category);
        } else {
            existingProduct.setCategory(null);
        }

        // Chuyển đổi và trả về ProductDetailDto
        return getProductDetailById(id);
    }

    @Override
    public Page<ProductDto> searchProducts(String keyword, int page, int size, Long shopId) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productsPage;

        if (shopId != null) {
            // Tìm kiếm theo keyword và shopId
            productsPage = productRepository.findByNameContainingAndShopId(keyword, shopId, pageable);
        } else {
            // Tìm kiếm chỉ theo keyword
            productsPage = productRepository.findByNameContaining(keyword, pageable);
        }

        return productsPage.map(this::convertToDto);
    }

    @Override
    public Page<ProductDto> filterByPrice(float minPrice, float maxPrice, int page, int size, Long shopId) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productsPage;
        if (shopId != null) {
            productsPage = productRepository.findByPriceBetweenAndShopId(minPrice, maxPrice, shopId, pageable);
        } else {
            productsPage = productRepository.findByPriceBetween(minPrice, maxPrice, pageable);
        }
        return productsPage.map(this::convertToDto);
    }

    @Override
    public Page<ProductDto> filterByStock(int threshold, int page, int size, Long shopId) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productsPage;
        if (shopId != null) {
            productsPage = productRepository.findByTotalVariantQuantityLessThanEqualAndShopId(threshold, shopId, pageable);
        } else {
            productsPage = productRepository.findByTotalVariantQuantityLessThanEqual(threshold, pageable);
        }
        return productsPage.map(this::convertToDto);
    }

    @Override
    public ProductDetailDto getProductDetailById(Long id) {
        Product product = productRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

        ProductDetailDto detailDto = new ProductDetailDto();

        // Map thông tin cơ bản
        detailDto.setId(Long.valueOf(product.getId()));
        //detailDto.setCode(product.getCode());
        detailDto.setName(product.getName());
        detailDto.setAlias(product.getAlias());
        detailDto.setPrice(product.getPrice());
        detailDto.setCost(product.getCost());
        detailDto.setMainImage(product.getMainImage());
        detailDto.setLastUpdated(product.getUpdatedAt());
        detailDto.setFullDescription(product.getFullDescription());
        detailDto.setEnabled(product.isEnabled());

        Map<String, ProductSpecificationDto> uniqueSpecs = new HashMap<>();
        product.getProductDetails().forEach(detail -> {
            ProductSpecificationDto spec = new ProductSpecificationDto();
            spec.setId(Long.valueOf(detail.getId()));
            spec.setName(detail.getName());
            spec.setValue(detail.getValue());

            // Chỉ giữ lại bản ghi mới nhất cho mỗi tên thông số
            uniqueSpecs.put(detail.getName(), spec);
        });

        List<ProductSpecificationDto> specs = new ArrayList<>(uniqueSpecs.values());
        detailDto.setSpecifications(specs);

        // Tính tổng số lượng từ variants
        int totalQuantity = 0;

        // Kiểm tra xem có biến thể con nào không
        boolean hasChildVariants = product.getVariants().stream()
                .anyMatch(variant -> variant.getParentId() != null);

        if (hasChildVariants) {
            // Nếu có biến thể con: tính tổng số lượng của các variant con
            totalQuantity = product.getVariants().stream()
                    .filter(variant -> variant.getParentId() != null)
                    .mapToInt(variant -> variant.getQuantity())
                    .sum();
        } else {
            // Nếu không có biến thể con: tính tổng số lượng của các variant gốc (parent_id = null)
            totalQuantity = product.getVariants().stream()
                    .filter(variant -> variant.getParentId() == null)
                    .mapToInt(variant -> variant.getQuantity())
                    .sum();
        }

        detailDto.setQuantity(totalQuantity);

        // Nhóm các variants theo key
        Map<String, List<ProductVariantDto>> variantMap = new HashMap<>();
        product.getVariants().forEach(variant -> {
            ProductVariantDto variantDto = new ProductVariantDto();
            variantDto.setId(Long.valueOf(variant.getId()));
            variantDto.setKey(variant.getKey());
            variantDto.setValue(variant.getValue());
            variantDto.setQuantity(variant.getQuantity());
            variantDto.setPhoto(variant.getPhoto());
            //variantDto.setParentId(Long.valueOf(variant.getParentId()));
            // Fixed null check
            if (variant.getParentId() != null) {
                variantDto.setParentId(Long.valueOf(variant.getParentId()));
            } else {
                variantDto.setParentId(null);
            }
            variantMap.computeIfAbsent(variant.getKey(), k -> new ArrayList<>()).add(variantDto);
        });

        // Chuyển map thành list nhóm biến thể
        List<ProductVariantGroupDto> variantGroups = variantMap.entrySet().stream()
                .map(entry -> {
                    ProductVariantGroupDto group = new ProductVariantGroupDto();
                    group.setName(entry.getKey());
                    group.setVariants(entry.getValue());
                    return group;
                }).collect(Collectors.toList());

        detailDto.setVariantGroups(variantGroups);

        //category
        if (product.getBrand() != null) {
            detailDto.setBrandId(Long.valueOf(product.getBrand().getId()));
            detailDto.setBrandName(product.getBrand().getName());
        }

        if (product.getCategory() != null) {
            detailDto.setCategoryId(Long.valueOf(product.getCategory().getId()));
            detailDto.setCategoryName(product.getCategory().getName());
        }

        return detailDto;
    }

    @Override
    public Page<ProductDto> getAllProducts(int page, int size, String sortField, String sortDir, Long shopId) {
        // Map tên trường DTO sang tên trường entity nếu cần
        if ("lastUpdated".equals(sortField)) {
            sortField = "updatedAt";
        }

        Sort sort = Sort.by(sortField);
        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> productPage;
        if (shopId != null) {
            productPage = productRepository.findByShopId(shopId, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }


        return productPage.map(this::convertToDto);
    }


    @Override
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public Product save(Product product) {
        return productRepository.save(product);
    }

    @Override
    public ProductDto setProductEnabled(Long id, boolean enabled) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

        product.setEnabled(enabled);
        Product savedProduct = productRepository.save(product);

        return convertToDto(savedProduct);
    }



    @Transactional
    @Override
    public ProductDetailDto createProductWithDetails(ProductDetailDto productDetailDto) {
        // Tạo sản phẩm mới
        Product product = new Product();
        product.setName(productDetailDto.getName());
        product.setAlias(createAlias(productDetailDto.getName())); // Tạo alias từ tên sản phẩm
        product.setPrice(productDetailDto.getPrice());
        product.setCost(productDetailDto.getCost());
        product.setEnabled(productDetailDto.isEnabled());
        product.setFullDescription(productDetailDto.getFullDescription());
        product.setMainImage(productDetailDto.getMainImage() != null ? productDetailDto.getMainImage() : "default-product.png");
        product.setShop(new Shop(1)); // Mặc định shopId = 1, cần thay đổi khi có hệ thống nhiều shop
        product.setCreatedAt(new Date());
        product.setUpdatedAt(new Date());

        Product savedProduct = productRepository.save(product);

        // Thêm thông số kỹ thuật
        if (productDetailDto.getSpecifications() != null) {
            for (ProductSpecificationDto specDto : productDetailDto.getSpecifications()) {
                if (specDto.getName() != null && specDto.getValue() != null) {
                    ProductDetail detail = new ProductDetail();
                    detail.setName(specDto.getName());
                    detail.setValue(specDto.getValue());
                    detail.setProduct(savedProduct);
                    savedProduct.getProductDetails().add(detail);
                }
            }
        }

        // Thêm biến thể sản phẩm
        if (productDetailDto.getVariantGroups() != null) {
            Map<Long, Long> oldToNewParentIds = new HashMap<>();

            // Xử lý biến thể cha trước
            for (ProductVariantGroupDto groupDto : productDetailDto.getVariantGroups()) {
                for (ProductVariantDto variantDto : groupDto.getVariants()) {
                    if (variantDto.getParentId() == null) {
                        ProductVariant variant = new ProductVariant();
                        variant.setKey(groupDto.getName());
                        variant.setValue(variantDto.getValue());
                        variant.setQuantity(variantDto.getQuantity());
                        variant.setPhoto(variantDto.getPhoto());
                        variant.setProduct(savedProduct);
                        variant.setParentId(null);

                        ProductVariant savedVariant = productVariantRepository.save(variant);
                        savedProduct.getVariants().add(savedVariant);

                        // Lưu ID tạm thời -> ID thực tế
                        oldToNewParentIds.put(variantDto.getId(), Long.valueOf(savedVariant.getId()));
                    }
                }
            }

            // Xử lý biến thể con
            for (ProductVariantGroupDto groupDto : productDetailDto.getVariantGroups()) {
                for (ProductVariantDto variantDto : groupDto.getVariants()) {
                    if (variantDto.getParentId() != null) {
                        Long parentId = oldToNewParentIds.get(variantDto.getParentId());
                        if (parentId != null) {
                            ProductVariant variant = new ProductVariant();
                            variant.setKey(groupDto.getName());
                            variant.setValue(variantDto.getValue());
                            variant.setQuantity(variantDto.getQuantity());
                            variant.setPhoto(variantDto.getPhoto());
                            variant.setProduct(savedProduct);
                            variant.setParentId(Math.toIntExact(parentId));

                            ProductVariant savedVariant = productVariantRepository.save(variant);
                            savedProduct.getVariants().add(savedVariant);
                        }
                    }
                }
            }
        }

        //brand
        if (productDetailDto.getBrandId() != null) {
            Brand brand = brandRepository.findById(Math.toIntExact(productDetailDto.getBrandId()))
                    .orElseThrow(() -> new EntityNotFoundException("Brand not found"));
            product.setBrand(brand);
        }
        //category
        if (productDetailDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(Math.toIntExact(productDetailDto.getCategoryId()))
                    .orElseThrow(() -> new EntityNotFoundException("Category not found"));
            product.setCategory(category);
        }

        productRepository.save(savedProduct);

        // Trả về DTO đầy đủ thông tin
        return getProductDetailById(Long.valueOf(savedProduct.getId()));
    }

    // Phương thức helper để tạo alias từ tên sản phẩm
    private String createAlias(String name) {
        if (name == null) return "";

        // Loại bỏ dấu và ký tự đặc biệt, thay thế khoảng trắng bằng dấu gạch ngang
        String alias = name.toLowerCase()
                .replaceAll("[àáạảãâầấậẩẫăằắặẳẵ]", "a")
                .replaceAll("[èéẹẻẽêềếệểễ]", "e")
                .replaceAll("[ìíịỉĩ]", "i")
                .replaceAll("[òóọỏõôồốộổỗơờớợởỡ]", "o")
                .replaceAll("[ùúụủũưừứựửữ]", "u")
                .replaceAll("[ỳýỵỷỹ]", "y")
                .replaceAll("[đ]", "d")
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("[\\s]", "-");

        return alias;
    }

    private ProductDto convertToDto(Product product) {
        ProductDto dto = modelMapper.map(product, ProductDto.class);

        // Map updatedAt to lastUpdated
        dto.setLastUpdated(product.getUpdatedAt());

        // Calculate total quantity from variants
        Integer totalQuantity = productVariantRepository.sumQuantityByProductId(Long.valueOf(product.getId()));
        dto.setQuantity(totalQuantity != null ? totalQuantity : 0);

        return dto;
    }
}
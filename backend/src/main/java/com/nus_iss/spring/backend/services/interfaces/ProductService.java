package com.nus_iss.spring.backend.services.interfaces;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Page;

import com.nus_iss.spring.backend.dtos.CreateProductDto;
import com.nus_iss.spring.backend.dtos.ProductDto;

public interface ProductService {
    Long createProduct(CreateProductDto productDto) throws IOException;

    ProductDto getProductById(Long id, Boolean discount, Double discountPercentage, Boolean giftWrap);

    List<ProductDto> getProductsBySellerId(Long sellerId);
    
    List<ProductDto> getAllProducts();

    Long updateProduct(CreateProductDto productDto, Long id) throws IOException;

    void deleteProduct(Long id);

    Page<ProductDto> searchProduct(String name, String category, int page, int size);
}

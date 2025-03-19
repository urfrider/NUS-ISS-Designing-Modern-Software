package com.nus_iss.spring.backend.services.interfaces;

import java.util.List;

import com.nus_iss.spring.backend.dtos.ProductDto;
import com.nus_iss.spring.backend.entities.Product;

public interface ProductService {
    Product createProduct(ProductDto productDto);

    ProductDto getProductById(Long id);

    List<ProductDto> getProductsBySellerId(Long sellerId);
    
    List<ProductDto> getAllProducts();

    Product updateProduct(ProductDto productDto, Long id);

    void deleteProduct(Long id);
}

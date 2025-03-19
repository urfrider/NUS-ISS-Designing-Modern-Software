package com.nus_iss.spring.backend.mappers;

import org.springframework.stereotype.Component;

import com.nus_iss.spring.backend.dtos.ProductDto;
import com.nus_iss.spring.backend.entities.Product;
import com.nus_iss.spring.backend.entities.Seller;

@Component
public class ProductMapper {
    public Product toEntity(ProductDto productDto, Seller seller){
        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setCategory(productDto.getCategory());
        product.setImages(productDto.getImages());
        product.setPrice(productDto.getPrice());
        product.setStock(productDto.getStock());
        product.setSeller(seller);
        return product;
    }

    public ProductDto toDto(Product product){
        ProductDto productDto = new ProductDto();
        productDto.setName(product.getName());
        productDto.setDescription(product.getDescription());
        productDto.setCategory(product.getCategory());
        productDto.setImages(product.getImages());
        productDto.setPrice(product.getPrice());
        productDto.setStock(product.getStock());
        productDto.setSellerId(product.getSeller().getId());        
        return productDto;
    }
}

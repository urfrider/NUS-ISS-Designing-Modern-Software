package com.nus_iss.spring.backend.mappers;

import java.io.IOException;

import org.springframework.stereotype.Component;

import com.nus_iss.spring.backend.dtos.CreateProductDto;
import com.nus_iss.spring.backend.dtos.ProductDto;
import com.nus_iss.spring.backend.entities.Product;
import com.nus_iss.spring.backend.entities.Seller;

@Component
public class ProductMapper {
    public Product toEntity(CreateProductDto productDto, Seller seller) throws IOException{
        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setCategory(productDto.getCategory());
        product.setImages(productDto.getImageFile().getBytes());
        product.setPrice(productDto.getPrice());
        product.setStock(productDto.getStock());
        product.setSeller(seller);
        return product;
    }

    public ProductDto toDto(Product product){
        ProductDto productDto = new ProductDto();
        productDto.setId(product.getId());
        productDto.setName(product.getName());
        productDto.setDescription(product.getDescription());
        productDto.setCategory(product.getCategory());
        productDto.setImages(product.getImages());
        productDto.setPrice(product.getPrice());
        productDto.setStock(product.getStock());
        productDto.setUsername(product.getSeller().getUsername());        
        return productDto;
    }
}

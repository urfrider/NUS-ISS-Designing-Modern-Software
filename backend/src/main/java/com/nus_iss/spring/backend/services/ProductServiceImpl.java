package com.nus_iss.spring.backend.services;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.nus_iss.spring.backend.controllers.UserController;
import com.nus_iss.spring.backend.dtos.ProductDto;
import com.nus_iss.spring.backend.entities.Product;
import com.nus_iss.spring.backend.entities.Seller;
import com.nus_iss.spring.backend.mappers.ProductMapper;
import com.nus_iss.spring.backend.repositories.ProductRepository;
import com.nus_iss.spring.backend.repositories.SellerRepository;
import com.nus_iss.spring.backend.services.interfaces.ProductService;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final SellerRepository sellerRepository;
    private final ProductMapper productMapper;
    private static final Logger logger = LoggerFactory.getLogger(ProductServiceImpl.class);


    @Override
    public Product createProduct(ProductDto productDto) {
        Seller seller = sellerRepository.findById(productDto.getSellerId())
            .orElseThrow(() -> new RuntimeException("Seller with Id: " + productDto.getSellerId() + " not found!"));
        Product product = productMapper.toEntity(productDto, seller);
        
        return productRepository.save(product);
    }

    @Override
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product with Id: " + id + " not found!"));
        
            return productMapper.toDto(product);
    }

    @Override
    public List<ProductDto> getProductsBySellerId(Long sellerId) {
        Seller seller = sellerRepository.findById(sellerId)
        .orElseThrow(() -> new RuntimeException("Seller with Id: " + sellerId + " not found!"));
        List<Product> products = productRepository.findBySeller(seller);
        
        return products.stream().map(productMapper::toDto).toList();
    }

    @Override
    public Product updateProduct(ProductDto productDto) {
        Product product = productRepository.findById(productDto.getId())
            .orElseThrow(() -> new RuntimeException("Product with ID" + productDto.getId() + " does not exist!"));
        
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setCategory(productDto.getCategory());
        product.setImages(productDto.getImages());
        product.setPrice(productDto.getPrice());
        product.setStock(productDto.getStock());
        
        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product with Id: " + id + " not found!"));
        productRepository.delete(product);
    }

    @Override
    public List<ProductDto> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream().map(productMapper::toDto).toList();
    }
}

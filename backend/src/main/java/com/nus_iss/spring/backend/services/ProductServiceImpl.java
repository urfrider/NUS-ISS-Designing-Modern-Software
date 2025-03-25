package com.nus_iss.spring.backend.services;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.nus_iss.spring.backend.dtos.CreateProductDto;
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
    public Long createProduct(CreateProductDto productDto) throws IOException {
        Seller seller = sellerRepository.findByUsername(productDto.getUsername())
            .orElseThrow(() -> new RuntimeException("Seller with Id: " + productDto.getUsername() + " not found!"));
        Product product = productMapper.toEntity(productDto, seller);
        
        Product savedProduct = productRepository.save(product);
        return savedProduct.getId();
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
    public Long updateProduct(CreateProductDto productDto, Long id) throws IOException {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product with ID" + id + " does not exist!"));
        
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setCategory(productDto.getCategory());
        product.setImages(productDto.getImageFile().getBytes());
        product.setPrice(productDto.getPrice());
        product.setStock(productDto.getStock());
        
        return productRepository.save(product).getId();
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

    @Override
    public Page<ProductDto> searchProduct(String name, String category, int page, int size) {
        logger.info("Searching with name: {}, category: {}, page: {}, size: {}", name, category, page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.asc("name")));
        Page<Product> productPage = productRepository.findByNameContainingIgnoreCaseAndCategoryContainingIgnoreCase(name, category, pageable);
        logger.info("Product Page Content: {}", productPage);

        List<ProductDto> productDtos = productPage.getContent().stream()
            .map(productMapper::toDto)
            .collect(Collectors.toList());

        return new PageImpl<>(productDtos, pageable, productPage.getTotalElements());
    }
}

package com.nus_iss.spring.backend.controllers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.nus_iss.spring.backend.dtos.CreateProductDto;
import com.nus_iss.spring.backend.dtos.ProductDto;
import com.nus_iss.spring.backend.services.interfaces.ProductService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_SELLER')")
    public ResponseEntity<String> createProduct(
        @RequestParam("name") String name,
        @RequestParam("description") String description,
        @RequestParam("category") String category,
        @RequestParam("stock") Integer stock,
        @RequestParam("price") Double price,
        @RequestParam("username") String username,
        @RequestParam("imageFile") MultipartFile imageFile,
        @RequestParam("hasDiscount") Boolean hasDiscount,
        @RequestParam("discountPercentage") Double discountPercentage
    ) {
        try {
            CreateProductDto createProductDto = new CreateProductDto();
            createProductDto.setCategory(category);
            createProductDto.setDescription(description);
            createProductDto.setImageFile(imageFile);
            createProductDto.setName(name);
            createProductDto.setPrice(price);
            createProductDto.setUsername(username);
            createProductDto.setStock(stock);
            createProductDto.setHasDiscount(hasDiscount);
            createProductDto.setDiscountPercentage(discountPercentage);
            logger.info("CREATEPRODUCT: {}", createProductDto);
            Long productId = productService.createProduct(createProductDto);
            return new ResponseEntity<>("Product ID: " + productId, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER', 'ROLE_SELLER')")
    public ResponseEntity<?> getProductById(@PathVariable("id") Long productId,
        @RequestParam(defaultValue = "false") boolean discount,
        @RequestParam(defaultValue = "0") double discountPercentage,
        @RequestParam(defaultValue = "false") boolean giftWrap) {
        try {
            
            ProductDto product  = productService.getProductById(productId, discount, discountPercentage, giftWrap);

            return new ResponseEntity<>(product, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/seller/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER', 'ROLE_SELLER')")
    public ResponseEntity<?> getProductsBySellerId(@PathVariable Long id) {
        try {
            return new ResponseEntity<>(productService.getProductsBySellerId(id), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER', 'ROLE_SELLER')")
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        return new ResponseEntity<>(productService.getAllProducts(), HttpStatus.OK);
    }
    
    @PutMapping("/{id}")
@PreAuthorize("hasAnyAuthority('ROLE_BUYER', 'ROLE_SELLER')")
public ResponseEntity<?> updateProduct(
        @PathVariable Long id,
        @RequestParam("name") String name,
        @RequestParam("description") String description,
        @RequestParam("category") String category,
        @RequestParam("stock") int stock,
        @RequestParam("price") double price,
        @RequestParam("username") String username,
        @RequestParam(value = "hasDiscount", required = false, defaultValue = "false") boolean hasDiscount,
        @RequestParam(value = "discountPercentage", required = false, defaultValue = "0") double discountPercentage,
        @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {

    try {
        logger.info("UPDATING PRODUCT: {}", name);

        CreateProductDto createProductDto = new CreateProductDto();
        createProductDto.setCategory(category);
        createProductDto.setDescription(description);
        createProductDto.setImageFile(imageFile);
        createProductDto.setName(name);
        createProductDto.setPrice(price);
        createProductDto.setUsername(username);
        createProductDto.setStock(stock);
        createProductDto.setHasDiscount(hasDiscount);
        createProductDto.setDiscountPercentage(discountPercentage);
        
        // Call service layer to update product
        Long productId = productService.updateProduct(createProductDto, id);

        return ResponseEntity.ok("Product with ID: " + productId + " updated successfully!");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }
}

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER', 'ROLE_SELLER')")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return new ResponseEntity<>("Successfully deleted!", HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProduct(
        @RequestParam String name,
        @RequestParam String category,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        logger.info("SEARCHING: {} {} {} {}", name, category, page, size);
        Page<ProductDto> productPage = productService.searchProduct(name, category, page, size);
        return ResponseEntity.ok(productPage);
    }
    
}

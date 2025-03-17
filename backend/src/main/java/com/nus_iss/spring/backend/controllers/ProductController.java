package com.nus_iss.spring.backend.controllers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nus_iss.spring.backend.dtos.ProductDto;
import com.nus_iss.spring.backend.entities.Product;
import com.nus_iss.spring.backend.services.interfaces.ProductService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
    public ResponseEntity<String> createProduct(@RequestBody ProductDto entity) {
        try {
            Product product = productService.createProduct(entity);
            return new ResponseEntity<>("Product ID: " + product.getId(), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER', 'ROLE_SELLER')")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        try {
            ProductDto product  = productService.getProductById(id);
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
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductDto entity) {
        try {
            entity.setId(id);
            logger.info("UPDATING PRODUCT: {}", entity);
            Product updatedProduct = productService.updateProduct(entity);
            return new ResponseEntity<>("Product with ID: " + updatedProduct.getId() + " updated successfully!", HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
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
}

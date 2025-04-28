package com.nus_iss.spring.backend.controllers;

import static org.mockito.Mockito.when;

import java.util.Collections;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.nus_iss.spring.backend.dtos.ProductDto;
import com.nus_iss.spring.backend.services.interfaces.ProductService;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProductControllerTest {

    // create mock productService
    @Mock
    private ProductService productService;

    // inj mock productService
    @InjectMocks
    private ProductController productController;

    // used to perform http req and res
    private MockMvc mockMvc;

    @BeforeEach
    void setup(){
        // Initializes the mocks (@Mock and @InjectMocks)
        MockitoAnnotations.openMocks(this);
        // Configures MockMvc with the controller to test it in isolation
        mockMvc = MockMvcBuilders.standaloneSetup(productController).build();
    }

    @Test
    void getAllProducts_ShouldReturnProducts() throws Exception {
        ProductDto product = new ProductDto();
        product.setId(1L);
        product.setName("Test Product");
        product.setPrice(100.0);

        // setting what should be returned
        when(productService.getAllProducts()).thenReturn(Collections.singletonList(product));

        // verifying thru api call
        mockMvc.perform(get("/api/products")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Test Product"))
                .andExpect(jsonPath("$[0].price").value(100.0));
    }

    @Test
    void getProductById_ShouldReturnProduct() throws Exception {
        ProductDto product = new ProductDto();
        product.setId(1L);
        product.setName("Test Product");
        product.setPrice(100.0);

        when(productService.getProductById(1L, false, (double) 0L, false)).thenReturn(product);

        mockMvc.perform(get("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Product"))
                .andExpect(jsonPath("$.price").value(100.0));

    }
}

package com.nus_iss.spring.backend.dtos;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateProductDto {
    private String name;
    private String description;
    private Double price;
    private String category;
    private MultipartFile imageFile;
    private String username;
    private Integer stock;
}
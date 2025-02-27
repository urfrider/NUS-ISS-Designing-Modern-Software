package com.nus_iss.spring.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductDto {
    private long id;
    private String name;
    private String description;
    private Double price;
    private String category;
    private String images;
    private Long sellerId;
    private Integer stock;
}

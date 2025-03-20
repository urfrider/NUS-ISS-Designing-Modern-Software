package com.nus_iss.spring.backend.dtos;


import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDto {
    private String name;
    private String description;
    private Double price;
    private String category;
    @Lob
    private byte[] images;
    private Long sellerId;
    private Integer quantity;
}

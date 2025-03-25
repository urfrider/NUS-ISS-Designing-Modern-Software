package com.nus_iss.spring.backend.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDto {
    private Long id;
    private Long buyerId;
    private double totalAmount;
    private List<CartItemDto> items;
}

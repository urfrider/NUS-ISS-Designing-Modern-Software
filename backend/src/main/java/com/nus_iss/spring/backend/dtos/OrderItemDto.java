package com.nus_iss.spring.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDto {
    private Long id;
    private Long productId;
    private Long orderId;
    private Long sellerId;
    private int quantity;
    private double price;
    private String status;
}

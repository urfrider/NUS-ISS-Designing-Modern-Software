package com.nus_iss.spring.backend.dtos;

import java.util.Date;
import java.util.List;

import com.nus_iss.spring.backend.entities.Product;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderDto {

    private Long id;
    private Long buyerId;
    private Long sellerId;
    private Double totalAmount;
    private String status;
    private Date createdAt;
    private List<Product> productList;
}

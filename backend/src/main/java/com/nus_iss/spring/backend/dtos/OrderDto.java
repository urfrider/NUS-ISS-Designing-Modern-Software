package com.nus_iss.spring.backend.dtos;

import java.util.Date;
import java.util.List;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDto {

    private Long id;
    private Long buyerId;
    private Double totalAmount;
    private String status;
    private Date createdAt;
    private List<OrderItemDto> orderItems;
}

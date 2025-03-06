package com.nus_iss.spring.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import org.springframework.data.domain.jaxb.SpringDataJaxb.OrderDto;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerDto {
    private Long id;
    private String username;
    private String uen;
    private List<ProductDto> productList;
    private List<OrderDto> orderList;
}
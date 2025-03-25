package com.nus_iss.spring.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BuyerSellerDto {

    private Long id;
    private String username;
    private String password;
    private String role;
    private String address;
    private String uen;  
    private String token;
    private Double balance;
}

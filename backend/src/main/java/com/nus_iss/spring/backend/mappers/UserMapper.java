package com.nus_iss.spring.backend.mappers;


import com.nus_iss.spring.backend.constants.Roles;
import com.nus_iss.spring.backend.dtos.BuyerSellerDto;
import com.nus_iss.spring.backend.entities.User;

public class UserMapper {
    public static BuyerSellerDto toBuyerSellerDto(User user) {
        if (user == null) {
            return null;
        }

        BuyerSellerDto buyerSellerDto = new BuyerSellerDto();
        buyerSellerDto.setUsername(user.getUsername());
        buyerSellerDto.setRole(user.getRole());
        
        if (user.getRole() == Roles.SELLER) {
            
        
        }
        
        return buyerSellerDto;
    }

    public static User toEntity(BuyerSellerDto buyerSellerDto) {
        if (buyerSellerDto == null) {
            return null;
        }

        User user = new User();

        user.setUsername(buyerSellerDto.getUsername());
        user.setRole(buyerSellerDto.getRole());
        user.setPassword(buyerSellerDto.getPassword());

        return user;
    }
}

package com.nus_iss.spring.backend.mappers;

import com.nus_iss.spring.backend.dtos.SellerDto;
import com.nus_iss.spring.backend.entities.Seller;

public class SellerMapper {

    public static SellerDto toDto(Seller seller) {
        if (seller == null) {
            return null;
        }
        
        SellerDto sellerDto = new SellerDto();
        sellerDto.setId(seller.getId());
        sellerDto.setUsername(seller.getUsername());
        sellerDto.setUen(seller.getUen());

        return sellerDto;
    }

    public static Seller toEntity(SellerDto sellerDto) {
        if (sellerDto == null) {
            return null;
        }
        
        Seller seller = new Seller();
        seller.setId(sellerDto.getId());
        seller.setUsername(sellerDto.getUsername());
        seller.setUen(sellerDto.getUen());

        return seller;
    }
    
}

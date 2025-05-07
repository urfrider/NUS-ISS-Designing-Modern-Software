package com.nus_iss.spring.backend.mappers;

import com.nus_iss.spring.backend.dtos.BuyerDto;
import com.nus_iss.spring.backend.dtos.CartDto;
import com.nus_iss.spring.backend.entities.Buyer;

public class BuyerMapper {

    static CartMapper cartMapper;

    public static BuyerDto toDto(Buyer buyer) {
        if (buyer == null) {
            return null;
        }
        
        BuyerDto buyerDTO = new BuyerDto();
        buyerDTO.setId(buyer.getId());
        buyerDTO.setUsername(buyer.getUsername());
        buyerDTO.setAddress(buyer.getAddress());

        CartDto cartDto = cartMapper.toDto(buyer.getCart());
        buyerDTO.setCart(cartDto);

        return buyerDTO;
    }

    public static Buyer toEntity(BuyerDto buyerDto) {
        if (buyerDto == null) {
            return null;
        }
        
        Buyer buyer = new Buyer();
        buyer.setId(buyerDto.getId());
        buyer.setUsername(buyerDto.getUsername());
        buyer.setAddress(buyerDto.getAddress());

        return buyer;
    }
}

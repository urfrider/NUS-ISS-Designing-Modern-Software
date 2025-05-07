package com.nus_iss.spring.backend.mappers;

import org.springframework.stereotype.Component;

import com.nus_iss.spring.backend.dtos.BuyerDto;
import com.nus_iss.spring.backend.dtos.CartDto;
import com.nus_iss.spring.backend.entities.Buyer;

@Component
public class BuyerMapper {

    public static BuyerDto toDto(Buyer buyer) {
        if (buyer == null) {
            return null;
        }
        
        BuyerDto buyerDTO = new BuyerDto();
        buyerDTO.setId(buyer.getId());
        buyerDTO.setUsername(buyer.getUsername());
        buyerDTO.setAddress(buyer.getAddress());
        buyerDTO.setBalance(buyer.getBalance());

        if (buyer.getCart() != null) {
            CartDto cartDto = CartMapper.toDto(buyer.getCart());

            buyerDTO.setCart(cartDto);
        } else {
            buyerDTO.setCart(null);
        }

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

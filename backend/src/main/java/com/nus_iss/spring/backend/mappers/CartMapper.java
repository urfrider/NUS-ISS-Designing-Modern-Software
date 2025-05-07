package com.nus_iss.spring.backend.mappers;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.nus_iss.spring.backend.dtos.CartDto;
import com.nus_iss.spring.backend.dtos.CartItemDto;
import com.nus_iss.spring.backend.entities.Cart;

@Component
public class CartMapper {

    public static CartDto toDto(Cart cart){
        CartDto cartDto = new CartDto();
        cartDto.setId(cart.getId());
        cartDto.setBuyerId(cart.getBuyer().getId());
        cartDto.setTotalAmount(cart.getTotalAmount());
        List<CartItemDto> cartItemDtos = cart.getCartItems().stream()
            .map((item) -> {
                CartItemDto cartItemDto = new CartItemDto();
                cartItemDto.setCategory(item.getProduct().getCategory());
                cartItemDto.setDescription(item.getProduct().getDescription());
                cartItemDto.setImages(item.getProduct().getImages());
                cartItemDto.setName(item.getProduct().getName());
                cartItemDto.setPrice(item.getProduct().getPrice());
                cartItemDto.setQuantity(item.getQuantity());
                cartItemDto.setSellerId(item.getProduct().getSeller().getId());
                cartItemDto.setProductId(item.getProduct().getId());
                cartItemDto.setDiscountPercentage(item.getProduct().getDiscountPercentage());
                cartItemDto.setHasDiscount(item.getProduct().getHasDiscount());
                return cartItemDto;
            })
            .collect(Collectors.toList());
        cartDto.setItems(cartItemDtos);
        return cartDto;

    }
}

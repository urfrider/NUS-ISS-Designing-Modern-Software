package com.nus_iss.spring.backend.services.interfaces;

import com.nus_iss.spring.backend.dtos.CartDto;
import com.nus_iss.spring.backend.entities.Cart;
import com.nus_iss.spring.backend.dtos.AddToCartDto;

public interface CartService {
    CartDto getCartByUsername(String username);

    Cart getCartById(Long id);

    CartDto getCartDtoById(Long id);

    CartDto getCartByUserId(Long userId);
    
    void addToCart(AddToCartDto cartDto);

    void removeFromCart(AddToCartDto cartItemDto);

    void emptyCart(Long id);

    void checkoutCart(Long id);

    void saveCart(Cart cart);
}

package com.nus_iss.spring.backend.services.interfaces;

import com.nus_iss.spring.backend.dtos.CartDto;
import com.nus_iss.spring.backend.dtos.AddToCartDto;

public interface CartService {
    CartDto getCart(Long id);
    
    CartDto addToCart(AddToCartDto cartDto);

    CartDto removeFromCart(AddToCartDto cartItemDto);

    CartDto emptyCart(Long id);

    CartDto checkoutCart(Long id);
}

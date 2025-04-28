package com.nus_iss.spring.backend.command;

import com.nus_iss.spring.backend.command.interfaces.Command;
import com.nus_iss.spring.backend.dtos.AddToCartDto;
import com.nus_iss.spring.backend.services.interfaces.CartService;

public class RemoveFromCartCommand implements Command {
    private final CartService cartService;
    private final AddToCartDto addToCartDto;

    public RemoveFromCartCommand(CartService cartService, AddToCartDto addToCartDto){
        this.addToCartDto = addToCartDto;
        this.cartService = cartService;
    }

    @Override
    public void execute() {
        cartService.removeFromCart(addToCartDto);
    }
    @Override
    public void undo() {
        cartService.addToCart(addToCartDto);
    }

}

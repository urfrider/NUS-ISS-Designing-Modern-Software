package com.nus_iss.spring.backend.command;

import com.nus_iss.spring.backend.command.interfaces.Command;
import com.nus_iss.spring.backend.dtos.AddToCartDto;
import com.nus_iss.spring.backend.services.interfaces.CartService;

import lombok.AllArgsConstructor;


@AllArgsConstructor
public class AddToCartCommand implements Command {
    private final CartService cartService;
    private final AddToCartDto addToCartDto;

    @Override
    public void execute() {
        cartService.addToCart(addToCartDto);
    }

    @Override
    public void undo() {
        cartService.removeFromCart(addToCartDto);
    }

}

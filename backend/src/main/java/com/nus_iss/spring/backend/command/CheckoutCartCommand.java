package com.nus_iss.spring.backend.command;

import com.nus_iss.spring.backend.command.interfaces.Command;
import com.nus_iss.spring.backend.services.interfaces.CartService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class CheckoutCartCommand implements Command {
    private final CartService cartService;
    private final Long cartId;

    @Override
    public void execute() {
        cartService.checkoutCart(cartId);
    }
    @Override
    public void undo() {
        throw new UnsupportedOperationException("Cannot undo checkout operation");    
    }
    
}

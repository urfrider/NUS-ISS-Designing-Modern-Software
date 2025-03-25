package com.nus_iss.spring.backend.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nus_iss.spring.backend.dtos.CartDto;
import com.nus_iss.spring.backend.dtos.AddToCartDto;
import com.nus_iss.spring.backend.services.interfaces.CartService;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;
    private static final Logger logger = LoggerFactory.getLogger(CartController.class);

    @PostMapping("/add")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER')")
    public ResponseEntity<?> addToCart(@RequestBody AddToCartDto addToCartDto) {
        try {
            CartDto cart = cartService.addToCart(addToCartDto);
            return ResponseEntity.ok(cart);
        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @DeleteMapping("/remove")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER')")
    public ResponseEntity<?> removeFromCart(@RequestBody AddToCartDto addToCartDto) {
        try {
            CartDto cart = cartService.removeFromCart(addToCartDto);
            return ResponseEntity.ok(cart);
        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/empty/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER')")
    public ResponseEntity<?> emptyCart(@PathVariable Long id) {
        try {
            logger.info("CARTID: {}", id);
            CartDto cart = cartService.emptyCart(id);
            return ResponseEntity.ok(cart);
        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/checkout/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER')")
    public ResponseEntity<?> checkoutCart(@PathVariable Long id) {
        try {
            CartDto cart = cartService.checkoutCart(id);
            return ResponseEntity.ok(cart);
        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER')")
    public ResponseEntity<?> getCartById(@PathVariable Long id) {
        logger.info("USERID: {}", id);
        CartDto cartDto = cartService.getCart(id);
        return ResponseEntity.ok(cartDto);
    }
    
}

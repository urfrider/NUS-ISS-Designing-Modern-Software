package com.nus_iss.spring.backend.factories;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.nus_iss.spring.backend.dtos.BuyerSellerDto;
import com.nus_iss.spring.backend.entities.Buyer;
import com.nus_iss.spring.backend.entities.Cart;
import com.nus_iss.spring.backend.entities.Seller;
import com.nus_iss.spring.backend.entities.User;
import com.nus_iss.spring.backend.repositories.BuyerRepository;
import com.nus_iss.spring.backend.repositories.SellerRepository;

@Component
public class UserFactory {

    @Autowired
    private PasswordEncoder encoder;
    
    @Autowired
    private BuyerRepository buyerRepository;

    @Autowired
    private SellerRepository sellerRepository;


    public User createUser(BuyerSellerDto user) {

        Long id = user.getId();
        String username = user.getUsername();
        String password = user.getPassword();
        String role = user.getRole();
        
        // Encode password before saving the user
        String encodedPassword = encoder.encode(password);

        if (role.equals("ROLE_BUYER")) {
            Buyer buyer = new Buyer();
            buyer.setId(id);
            buyer.setUsername(username);
            buyer.setPassword(encodedPassword);
            buyer.setRole("ROLE_BUYER");
            buyer.setAddress(user.getAddress());
            buyer.setBalance(0.0);
            
            Cart cart = new Cart();
            cart.setBuyer(buyer);
            cart.setCartItems(new ArrayList<>());
            buyer.setCart(cart);
            return buyerRepository.save(buyer);
        } else if (role.equals("ROLE_SELLER")) {
            Seller seller = new Seller();
            seller.setId(id);
            seller.setUsername(username);
            seller.setPassword(encodedPassword);
            seller.setRole("ROLE_SELLER");
            seller.setUen(user.getUen());
            seller.setBalance(0.0);
            return sellerRepository.save(seller);
        }
        throw new IllegalArgumentException("Unknown role: " + role);
    }
}

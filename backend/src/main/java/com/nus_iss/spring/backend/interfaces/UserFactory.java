package com.nus_iss.spring.backend.interfaces;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.nus_iss.spring.backend.dtos.BuyerSellerDto;
import com.nus_iss.spring.backend.entities.Buyer;
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

        String username = user.getUsername();
        String password = user.getPassword();
        String role = user.getRole();
        
        // Encode password before saving the user
        String encodedPassword = encoder.encode(password);

        if (role.equals("ROLE_BUYER")) {
            Buyer buyer = new Buyer();
            buyer.setUsername(username);
            buyer.setPassword(encodedPassword);
            buyer.setRole("ROLE_BUYER");
            buyer.setAddress(user.getAddress());
            return buyerRepository.save(buyer);
        } else if (role.equals("ROLE_SELLER")) {
            Seller seller = new Seller();
            seller.setUsername(username);
            seller.setPassword(encodedPassword);
            seller.setRole("ROLE_SELLER");
            seller.setUen(user.getUen());
            return sellerRepository.save(seller);
        }
        throw new IllegalArgumentException("Unknown role: " + role);
    }
}

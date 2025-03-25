package com.nus_iss.spring.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.nus_iss.spring.backend.constants.Roles;
import com.nus_iss.spring.backend.dtos.BuyerSellerDto;
import com.nus_iss.spring.backend.entities.User;
import com.nus_iss.spring.backend.entities.UserInfoDetails;
import com.nus_iss.spring.backend.factories.UserFactory;
import com.nus_iss.spring.backend.repositories.UserRepository;

import java.util.Optional;

@Service
public class UserInfoService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserFactory userFactory;  

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);

        // Converting User to UserDetails
        return user.map(UserInfoDetails::new)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public User findUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);
    
        return user.orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }
    
    public String addUser(BuyerSellerDto userInfo) throws Exception {
        Optional<User> existingUser = userRepository.findByUsername(userInfo.getUsername());
        
        if (existingUser.isPresent()){
            throw new Exception("Username " + userInfo.getUsername() + " already exists!");
        }

        User createdUser = userFactory.createUser(userInfo);
        String createdUserRole = createdUser.getRole();

        if (Roles.BUYER.equals(createdUserRole)) {
            return "Buyer Added Successfully";
        } else if (Roles.SELLER.equals(createdUserRole)) {
            return "Seller Added Successfully";
        } else {
            return "Unknown Role Added Successfully";  
        }
    }

    public void updateUserBalance(String username, Double amount, String operation){
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User " + username + " does not exist!"));
        if (operation == "SUBTRACT" && user.getBalance() < amount){
            throw new RuntimeException("Balance is low!");
        }

        if (operation == "ADD"){
            user.setBalance(user.getBalance() + amount);
        } else if (operation == "SUBTRACT"){
            user.setBalance(user.getBalance() - amount);
        } else{
            throw new IllegalArgumentException("Wrong operation!");
        }

        userRepository.save(user);
    }
}
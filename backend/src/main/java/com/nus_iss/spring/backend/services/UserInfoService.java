package com.nus_iss.spring.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nus_iss.spring.backend.constants.Roles;
import com.nus_iss.spring.backend.dtos.BuyerSellerDto;
import com.nus_iss.spring.backend.entities.User;
import com.nus_iss.spring.backend.entities.UserInfoDetails;
import com.nus_iss.spring.backend.repositories.BuyerRepository;
import com.nus_iss.spring.backend.repositories.SellerRepository;
import com.nus_iss.spring.backend.repositories.UserRepository;
import com.nus_iss.spring.backend.interfaces.UserFactory;

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
    
    public String addUser(BuyerSellerDto userInfo) {

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
}
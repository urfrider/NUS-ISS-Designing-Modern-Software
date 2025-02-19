package com.nus_iss.spring.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nus_iss.spring.backend.entities.User;
import com.nus_iss.spring.backend.entities.UserInfoDetails;
import com.nus_iss.spring.backend.repositories.UserRepository;

import java.util.Optional;

@Service
public class UserInfoService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

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
    
    public String addUser(User userInfo) throws Exception {
        Optional<User> existingUser = userRepository.findByUsername(userInfo.getUsername());
        
        if (existingUser.isPresent()){
            throw new Exception("Username " + userInfo.getUsername() + " already exists!");
        }
        // Encode password before saving the user
        userInfo.setPassword(encoder.encode(userInfo.getPassword()));
        userRepository.save(userInfo);
        return "User Added Successfully!";
    }
}
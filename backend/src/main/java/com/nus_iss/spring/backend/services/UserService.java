package com.nus_iss.spring.backend.services;

import java.util.List;

import com.nus_iss.spring.backend.entities.User;

public interface UserService {
    public User createUser(User user);
    public List<User> getAllUsers();
}

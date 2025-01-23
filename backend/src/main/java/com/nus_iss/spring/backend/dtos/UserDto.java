package com.nus_iss.spring.backend.dtos;

import lombok.Data;

@Data
public class UserDto {
    String username;
    String role;
    String token;
}

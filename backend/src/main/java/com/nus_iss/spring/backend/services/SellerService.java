package com.nus_iss.spring.backend.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.nus_iss.spring.backend.dtos.SellerDto;
import com.nus_iss.spring.backend.entities.Seller;
import com.nus_iss.spring.backend.mappers.SellerMapper;
import com.nus_iss.spring.backend.repositories.SellerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SellerService {
    private final SellerRepository sellerRepository;

    public SellerDto getSellerById(Long id) {
        Optional<Seller> buyerOptional = sellerRepository.findById(id);
        
        if (buyerOptional.isPresent()) {
            System.out.println("Seller found: " + buyerOptional.get());  // Print if found
            return SellerMapper.toDto(buyerOptional.get());
        } else {
            System.out.println("Seller not found with ID: " + id);  // Print if not found
            throw new RuntimeException("Seller not found");
        }
    }
    
}

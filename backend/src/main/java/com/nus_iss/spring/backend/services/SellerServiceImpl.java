package com.nus_iss.spring.backend.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.nus_iss.spring.backend.dtos.SellerDto;
import com.nus_iss.spring.backend.entities.Seller;
import com.nus_iss.spring.backend.mappers.SellerMapper;
import com.nus_iss.spring.backend.repositories.SellerRepository;
import com.nus_iss.spring.backend.services.interfaces.SellerService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService{
    private final SellerRepository sellerRepository;

    @Override
    public SellerDto getSellerById(Long id) {
        Optional<Seller> sellerOptional = sellerRepository.findById(id);
        
        if (sellerOptional.isPresent()) {
            System.out.println("Seller found: " + sellerOptional.get());  // Print if found
            return SellerMapper.toDto(sellerOptional.get());
        } else {
            System.out.println("Seller not found with ID: " + id);  // Print if not found
            throw new RuntimeException("Seller not found");
        }
    }

    @Override
    public Seller getSellerByUsername(String username) {
        Optional<Seller> sellerOptional = sellerRepository.findByUsername(username);
        
        if (sellerOptional.isPresent()) {
            System.out.println("Seller found: " + sellerOptional.get());  // Print if found
            return sellerOptional.get();
        } else {
            System.out.println("Seller not found with username: " + username);  // Print if not found
            throw new RuntimeException("Seller not found");
        }
    }

    @Override
    @Transactional
    public SellerDto editSellerProfile(SellerDto sellerDto) {
        Long sellerId = sellerDto.getId();
        Optional<Seller> sellerOptional = sellerRepository.findById(sellerId);
        
        if (sellerOptional.isPresent()) {
            Seller seller = sellerOptional.get();
            seller.setUsername(sellerDto.getUsername());
            seller.setUen(sellerDto.getUen());
            seller.setBalance(sellerDto.getBalance());
            sellerRepository.save(seller);
            return SellerMapper.toDto(seller);
        } else {
            System.out.println("Seller not found with ID: " + sellerId);  // Print if not found
            throw new RuntimeException("Seller not found");
        }
    }

    @Override
    @Transactional
    public SellerDto deleteSellerProfile(Long sellerId) {
        Optional<Seller> sellerOptional = sellerRepository.findById(sellerId);

        if (sellerOptional.isPresent()) {
            Seller seller = sellerOptional.get();
            sellerRepository.delete(seller);
            return SellerMapper.toDto(seller);
        } else {
            System.out.println("Seller not found with ID: " + sellerId);  // Print if not found
            throw new RuntimeException("Seller not found");
        }
    }
    
}

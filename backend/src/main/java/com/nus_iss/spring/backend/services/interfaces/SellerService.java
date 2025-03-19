package com.nus_iss.spring.backend.services.interfaces;

import com.nus_iss.spring.backend.dtos.SellerDto;
import com.nus_iss.spring.backend.entities.Seller;

public interface SellerService {

    SellerDto getSellerById(Long id);
    
    Seller getSellerByUsername(String username);
    
    SellerDto editSellerProfile(SellerDto sellerDto);
    
    SellerDto deleteSellerProfile(Long sellerId);
}

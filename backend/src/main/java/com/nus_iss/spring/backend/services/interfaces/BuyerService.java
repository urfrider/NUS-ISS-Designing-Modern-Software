package com.nus_iss.spring.backend.services.interfaces;

import com.nus_iss.spring.backend.dtos.BuyerDto;
import com.nus_iss.spring.backend.entities.Buyer;

public interface BuyerService {

    BuyerDto getBuyerById(Long id);
    
    Buyer getBuyerByUsername(String username);
    
    BuyerDto editBuyerProfile(BuyerDto buyerDto);
    
    BuyerDto deleteBuyerProfile(Long buyerId);
    
    void checkout(Long buyerId);
}

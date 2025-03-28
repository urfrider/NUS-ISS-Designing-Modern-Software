package com.nus_iss.spring.decorators.interfaces;

import com.nus_iss.spring.backend.entities.Seller;

public interface ProductComponent {
    long getId();                
    String getName();            
    String getDescription();     
    Double getPrice();           
    Integer getStock();          
    String getCategory();        
    byte[] getImages();          
    Seller getSeller();   
    Boolean getHasDiscount();
    Double getDiscountPercentage();       
}
package com.nus_iss.spring.decorators;

import com.nus_iss.spring.backend.entities.Seller;
import com.nus_iss.spring.decorators.interfaces.ProductComponent;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class GiftWrapDecorator extends ProductDecorator {
    private ProductComponent product;

    @Override
    public String getDescription() {
        return product.getDescription();
    }

    @Override
    public Double getPrice() {
        return product.getPrice() + 5.0; // Adds $5 for gift wrapping
    }

    @Override
    public long getId() {
        return product.getId();
    }

    @Override
    public String getName() {
        return product.getName()+ " [Gift Wrapped]";
    }

    @Override
    public Integer getStock() {
        return product.getStock();
    }

    @Override
    public String getCategory() {
        return product.getCategory();
    }

    @Override
    public byte[] getImages() {
        return product.getImages();
    }

    @Override
    public Seller getSeller() {
        return product.getSeller();
    }

    @Override
    public Double getDiscountPercentage() {
        return product.getDiscountPercentage();
    }

    @Override
    public Boolean getHasDiscount() {
        return product.getHasDiscount();
    }
}
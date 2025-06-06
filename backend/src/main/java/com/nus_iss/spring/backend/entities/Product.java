package com.nus_iss.spring.backend.entities;

import com.nus_iss.spring.decorators.interfaces.ProductComponent;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product implements ProductComponent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String description;
    private Double price;
    private String category;
    @Lob
    @ToString.Exclude
    private byte[] images;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    @ToString.Exclude  // Prevents infinite recursion
    private Seller seller;
    private Integer stock;
    private Boolean hasDiscount;
    private Double discountPercentage;
}

package com.nus_iss.spring.backend.entities;


import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sellers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false) 
public class Seller extends User {

    private String uen;

    // @OneToMany(mappedBy = "seller")
    // private List<Product> productList;

    // @OneToMany(mappedBy = "seller")
    // private List<Order> orderList;

}
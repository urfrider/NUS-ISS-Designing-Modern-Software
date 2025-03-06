package com.nus_iss.spring.backend.entities;

import java.util.List;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
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

    // // Seller specific methods here
    // public void listProduct(Product product) {
    //     // List product logic
    // }

    // public void updateInventory(Product product) {
    //     // Update inventory logic
    // }

    public void viewOrders() {
        // View orders logic
    }
}
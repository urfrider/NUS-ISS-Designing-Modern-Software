package com.nus_iss.spring.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nus_iss.spring.backend.entities.Buyer;
import com.nus_iss.spring.backend.entities.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByBuyer(Buyer buyer);
}

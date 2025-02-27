package com.nus_iss.spring.backend.repositories;
import org.springframework.data.jpa.repository.JpaRepository;

import com.nus_iss.spring.backend.entities.Seller;

import java.util.Optional;

public interface SellerRepository extends JpaRepository<Seller, Long> {
    Optional<Seller> findById(Long id);

    Optional<Seller> findByUsername(String username);
}
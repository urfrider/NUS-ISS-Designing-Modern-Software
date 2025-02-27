package com.nus_iss.spring.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nus_iss.spring.backend.entities.Buyer;

import java.util.Optional;

public interface BuyerRepository extends JpaRepository<Buyer, Long> {
    Optional<Buyer> findById(Long id);

    Optional<Buyer> findByUsername(String username);
}
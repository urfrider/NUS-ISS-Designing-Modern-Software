package com.nus_iss.spring.backend.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nus_iss.spring.backend.entities.Product;
import com.nus_iss.spring.backend.entities.Seller;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findBySeller(Seller seller);
    Page<Product> findByNameContainingIgnoreCaseAndCategoryContainingIgnoreCase(String name, String category, Pageable pageable);
}

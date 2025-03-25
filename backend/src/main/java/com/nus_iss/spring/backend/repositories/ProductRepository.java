package com.nus_iss.spring.backend.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.nus_iss.spring.backend.entities.Product;
import com.nus_iss.spring.backend.entities.Seller;


@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findBySeller(Seller seller);
    Page<Product> findByNameContainingIgnoreCaseAndCategoryContainingIgnoreCase(String name, String category, Pageable pageable);
    @Query(
        "SELECT p from Product p " +
        "WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) AND " +
        "LOWER(p.category) LIKE LOWER(CONCAT('%', :category, '%'))"
    )
    Page<Product> searchProducts(
        @Param("name") String name, 
        @Param("category") String category,
        Pageable pageable
    );
}

package com.nus_iss.spring.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.nus_iss.spring.backend.entities.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Fetch all reviews for a specific product
    List<Review> findByProductId(Long productId);
}

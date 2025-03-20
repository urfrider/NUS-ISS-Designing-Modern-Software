package com.nus_iss.spring.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nus_iss.spring.backend.entities.Review;
import com.nus_iss.spring.backend.repositories.ReviewRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ReviewServiceImpl {
    
    @Autowired
    private ReviewRepository reviewRepository;

    public Review writeReview(Review review) {
        return reviewRepository.save(review);
    }

    public List<Review> getReviewByProductId(Long productId) {
        // Fetch the list of reviews for a product
        return reviewRepository.findByProductId(productId);
    }

}

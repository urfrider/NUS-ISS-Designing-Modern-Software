package com.nus_iss.spring.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.nus_iss.spring.backend.dtos.ReviewDto;
import com.nus_iss.spring.backend.entities.Buyer;
import com.nus_iss.spring.backend.entities.Product;
import com.nus_iss.spring.backend.entities.Review;
import com.nus_iss.spring.backend.repositories.BuyerRepository;
import com.nus_iss.spring.backend.repositories.ProductRepository;
import com.nus_iss.spring.backend.repositories.ReviewRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ReviewServiceImpl {
    
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private BuyerRepository buyerRepository;
    @Autowired
    private ProductRepository productRepository;

    public Review writeReview(ReviewDto review) {
        // Create a new Review entity from the DTO
        Review reviewEntity = new Review();
        Buyer buyer = buyerRepository.findById(review.getBuyer())
            .orElseThrow(() -> new RuntimeException("Buyer does not exist!"));
        Product product = productRepository.findById(review.getProduct())
            .orElseThrow(() -> new RuntimeException("Product does not exist!"));

        reviewEntity.setBuyer(buyer);
        reviewEntity.setProduct(product);
        reviewEntity.setRating(review.getRating());
        reviewEntity.setContent(review.getContent());
        // Save the review to the database
        return reviewRepository.save(reviewEntity);
    }

    @Transactional
    public List<ReviewDto> searchReviews(Long productId) {
        // Fetch the list of reviews for a product
        System.out.println("Service Received Product ID: " + productId);
        List<Review> reviews = reviewRepository.getAllReviews();
        // Filter the reviews based on the product ID
        reviews = reviews.stream()
            .filter(review -> review.getProduct().getId() == productId)
            .toList();
        List<ReviewDto> reviewDtos = reviews.stream()
            .map(review -> new ReviewDto(
                review.getBuyer().getId(),
                review.getProduct().getId(),
                review.getRating(),
                review.getContent()))
            .toList();
        System.out.println("Review DTOs: " + reviewDtos);
        return reviewDtos;
    }

}

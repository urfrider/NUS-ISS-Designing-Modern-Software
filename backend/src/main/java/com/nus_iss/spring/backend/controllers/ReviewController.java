package com.nus_iss.spring.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nus_iss.spring.backend.entities.Review;
import com.nus_iss.spring.backend.services.ReviewServiceImpl;
import com.nus_iss.spring.backend.services.interfaces.OrderService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/reviews")
public class ReviewController {
    
    @Autowired
    private ReviewServiceImpl reviewService;

    @PostMapping("/write")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER')")
    public ResponseEntity<Review> writeReview(@RequestBody Review review) {
        Review savedReview = reviewService.writeReview(review);
        return ResponseEntity.ok(savedReview);
    }

    @GetMapping("/product/{productId}")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER', 'ROLE_SELLER')")
    public ResponseEntity<List<Review>> getReviewByProductId(Long productId) {
        return ResponseEntity.ok(reviewService.getReviewByProductId(productId));
    }
}

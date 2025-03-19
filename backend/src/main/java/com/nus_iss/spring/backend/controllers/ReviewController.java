package com.nus_iss.spring.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nus_iss.spring.backend.services.interfaces.OrderService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/reviews")
public class ReviewController {
    
    // @Autowired
    // private ReviewService reviewService;

    
}

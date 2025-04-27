package com.nus_iss.spring.backend.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nus_iss.spring.backend.dtos.ReviewDto;
import com.nus_iss.spring.backend.entities.Product;
import com.nus_iss.spring.backend.entities.Review;
import com.nus_iss.spring.backend.services.ReviewServiceImpl;

public class ReviewControllerTest {

    @Mock
    private ReviewServiceImpl reviewService;

    @InjectMocks
    private ReviewController reviewController;

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setup(){
        // Initializes the mocks (@Mock and @InjectMocks)
        MockitoAnnotations.openMocks(this);
        // Configures MockMvc with the controller to test it in isolation
        mockMvc = MockMvcBuilders.standaloneSetup(reviewController).build();
    }

    @Test
    public void testWriteReview() throws Exception {
         ReviewDto reviewDto = new ReviewDto();
         reviewDto.setProduct(1L);
         reviewDto.setRating(5);
         reviewDto.setContent("Great product!");

         Review savedReview = new Review();
         savedReview.setId(1L);
         Product product = new Product();
         product.setId(1L);
         savedReview.setProduct(product);
         savedReview.setRating(5);
         savedReview.setContent("Great product!");

         when(reviewService.writeReview(any(ReviewDto.class))).thenReturn(savedReview);

         mockMvc.perform(post("/api/reviews/write")
                 .contentType(MediaType.APPLICATION_JSON)
                 .content(objectMapper.writeValueAsString(reviewDto)))
                 .andExpect(status().isOk())
                 .andExpect(jsonPath("$.id").value(savedReview.getId()))
                 .andExpect(jsonPath("$.product.id").value(savedReview.getProduct().getId()))
                 .andExpect(jsonPath("$.rating").value(savedReview.getRating()))
                 .andExpect(jsonPath("$.content").value(savedReview.getContent()));

         verify(reviewService, times(1)).writeReview(any(ReviewDto.class));
    }

    @Test
    public void testSearchReviews() throws Exception {
        Long productId = 1L;

        ReviewDto review1 = new ReviewDto();
        review1.setProduct(productId);
        review1.setRating(5);
        review1.setContent("Excellent!");

        ReviewDto review2 = new ReviewDto();
        review2.setProduct(productId);
        review2.setRating(4);
        review2.setContent("Good!");

        List<ReviewDto> reviews = Arrays.asList(review1, review2);

        when(reviewService.searchReviews(productId)).thenReturn(reviews);

        mockMvc.perform(get("/api/reviews/product/{productId}", productId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(reviews.size()))
                .andExpect(jsonPath("$[0].rating").value(review1.getRating()))
                .andExpect(jsonPath("$[0].content").value(review1.getContent()))
                .andExpect(jsonPath("$[1].rating").value(review2.getRating()))
                .andExpect(jsonPath("$[1].content").value(review2.getContent()));

        verify(reviewService, times(1)).searchReviews(productId);
    }
}

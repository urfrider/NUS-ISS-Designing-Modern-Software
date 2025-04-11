package com.nus_iss.spring.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDto {
    private Long buyer;
    private Long product;
    private int rating;
    private String content;
}

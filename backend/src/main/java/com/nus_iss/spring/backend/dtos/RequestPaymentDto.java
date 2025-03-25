package com.nus_iss.spring.backend.dtos;

import java.util.Map;

import lombok.Data;

@Data
public class RequestPaymentDto {
    private String paymentType;
    private double amount;
    private Map<String, String> details;
}

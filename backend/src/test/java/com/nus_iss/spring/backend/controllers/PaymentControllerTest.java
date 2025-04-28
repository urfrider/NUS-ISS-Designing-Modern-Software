package com.nus_iss.spring.backend.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doNothing;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.nus_iss.spring.backend.dtos.RequestPaymentDto;
import com.nus_iss.spring.backend.services.PaymentService;

class PaymentControllerTest {

    @Mock
    private PaymentService paymentService;

    @InjectMocks
    private PaymentController paymentController;

    public PaymentControllerTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testMakePayment() {
        // Arrange
        RequestPaymentDto requestBody = new RequestPaymentDto();
        requestBody.setPaymentType("credit_card");
        requestBody.setAmount(100.0);
        requestBody.setDetails(Map.of("cardNumber", "1234567890123456"));

        doNothing().when(paymentService).processPayment(
            "credit_card", 
            100.0, 
            Map.of("cardNumber", 
            "1234567890123456"));

        // Act
        ResponseEntity<String> response = paymentController.makePayment(requestBody);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Payment successful using credit_card", response.getBody());
    }
}
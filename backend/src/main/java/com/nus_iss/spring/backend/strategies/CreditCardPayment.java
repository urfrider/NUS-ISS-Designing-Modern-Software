package com.nus_iss.spring.backend.strategies;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.nus_iss.spring.backend.strategies.interfaces.PaymentStrategy;

@Service("creditCard")
public class CreditCardPayment implements PaymentStrategy {

    @Override
    public void processPayment(double amount, Map<String, String> details) {
        String cardNumber = details.get("cardNumber");
        String cardHolder = details.get("cardHolder");

        if (cardNumber == null || cardHolder == null) {
            throw new IllegalArgumentException("Card details are missing");
        }

        System.out.println("Processing credit card payment of $" + amount + 
            " with card " + cardNumber + " belonging to " + cardHolder);
    }
}
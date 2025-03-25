package com.nus_iss.spring.backend.strategies;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.nus_iss.spring.backend.strategies.interfaces.PaymentStrategy;

@Service("paypal")
public class PaypalPayment implements PaymentStrategy {

    @Override
    public void processPayment(double amount, Map<String, String> details) {
        String paypalEmail = details.get("paypalEmail");
        if (paypalEmail == null) {
            throw new IllegalArgumentException("PayPal email is missing");
        }

        System.out.println("Processing PayPal payment of $" + amount + 
            " with email " + paypalEmail);
    }
}
package com.nus_iss.spring.backend.strategies;

import com.nus_iss.spring.backend.strategies.interfaces.PaymentStrategy;

public class PaypalPayment implements PaymentStrategy {

    private String paypalEmail;

    public PaypalPayment(String paypalEmail) {
        this.paypalEmail = paypalEmail;
    }

    @Override
    public void processPayment(double amount) {
        System.out.println("Processing PayPal payment of $" + amount);
        // Logic to process payment via PayPal
    }
}
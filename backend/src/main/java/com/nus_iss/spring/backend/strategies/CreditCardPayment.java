package com.nus_iss.spring.backend.strategies;

import com.nus_iss.spring.backend.strategies.interfaces.PaymentStrategy;

public class CreditCardPayment implements PaymentStrategy {

    private String cardNumber;
    private String cardHolder;

    public CreditCardPayment(String cardNumber, String cardHolder) {
        this.cardNumber = cardNumber;
        this.cardHolder = cardHolder;
    }

    @Override
    public void processPayment(double amount) {
        System.out.println("Processing credit card payment of $" + amount);
        // Logic to process payment via credit card
    }
}
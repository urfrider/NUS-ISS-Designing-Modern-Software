package com.nus_iss.spring.backend.strategies.interfaces;

import java.util.Map;

public interface PaymentStrategy {
    void processPayment(double amount, Map<String, String> details);
}

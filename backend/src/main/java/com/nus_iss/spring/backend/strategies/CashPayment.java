package com.nus_iss.spring.backend.strategies;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.nus_iss.spring.backend.strategies.interfaces.PaymentStrategy;

@Service("cash")
public class CashPayment implements PaymentStrategy {

    @Override
    public void processPayment(double amount, Map<String, String> details) {
        System.out.println("Processing cash payment of $" + amount);
    }

}

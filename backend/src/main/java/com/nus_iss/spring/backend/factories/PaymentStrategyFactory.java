package com.nus_iss.spring.backend.factories;

import java.util.Map;

import org.springframework.stereotype.Component;

import com.nus_iss.spring.backend.strategies.interfaces.PaymentStrategy;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Component
public class PaymentStrategyFactory {

    private final Map<String, PaymentStrategy> strategies;
    
    public PaymentStrategy getStrategy(String strategyType){
        PaymentStrategy strategy = strategies.get(strategyType);
        if (strategy == null){
            throw new IllegalArgumentException("Invalid payment type: " + strategyType);
        }
        return strategy;
    }

}

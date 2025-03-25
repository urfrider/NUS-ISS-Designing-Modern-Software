package com.nus_iss.spring.backend.services;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.nus_iss.spring.backend.factories.PaymentStrategyFactory;
import com.nus_iss.spring.backend.services.interfaces.CartService;
import com.nus_iss.spring.backend.strategies.interfaces.PaymentStrategy;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class PaymentService {
    private final PaymentStrategyFactory strategyFactory;
    private final CartService cartService;
    private final UserInfoService userService;
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    public void processPayment(String paymentType, double amount, Map<String, String> details){
        PaymentStrategy paymentStrategy = strategyFactory.getStrategy(paymentType);

        logger.info("PROCESSING PAYMENT");
        paymentStrategy.processPayment(amount, details);

        logger.info("SUBTRACTING BUYER BALANCE");
        userService.updateUserBalance(
            details.get("username"),
            amount,
            "SUBTRACT"
        );

        Long cartId = Long.parseLong(details.get("cartId"));

        logger.info("CHECKING OUT CART");
        cartService.checkoutCart(cartId);

        logger.info("PAYMENT SUCCESSFUL");
    }
}

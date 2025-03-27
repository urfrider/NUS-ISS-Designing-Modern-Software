package com.nus_iss.spring.backend.services.interfaces;

public interface OrderItemService {
    void nextState(Long orderItemId);
    void cancelOrder(Long orderItemId);
}

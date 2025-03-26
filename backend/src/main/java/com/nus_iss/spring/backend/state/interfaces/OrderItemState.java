package com.nus_iss.spring.backend.state.interfaces;

import com.nus_iss.spring.backend.entities.OrderItem;

public interface OrderItemState {
    void next(OrderItem orderItem);
    void cancel(OrderItem orderItem);
    String getStatus();
}

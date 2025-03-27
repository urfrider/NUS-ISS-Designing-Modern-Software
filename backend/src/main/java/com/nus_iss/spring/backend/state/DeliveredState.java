package com.nus_iss.spring.backend.state;

import com.nus_iss.spring.backend.entities.OrderItem;
import com.nus_iss.spring.backend.state.interfaces.OrderItemState;

public class DeliveredState implements OrderItemState {

    @Override
    public void next(OrderItem orderItem) {
        throw new IllegalStateException("Order already delivered.");
    }

    @Override
    public void cancel(OrderItem orderItem) {
        throw new IllegalStateException("Cannot cancel a delivered order.");
    }

    @Override
    public String getStatus() {
        return "DELIVERED";
    }

}

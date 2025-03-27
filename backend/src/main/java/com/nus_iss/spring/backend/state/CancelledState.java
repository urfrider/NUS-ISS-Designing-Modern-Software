package com.nus_iss.spring.backend.state;

import com.nus_iss.spring.backend.entities.OrderItem;
import com.nus_iss.spring.backend.state.interfaces.OrderItemState;

public class CancelledState implements OrderItemState {

    @Override
    public void next(OrderItem orderItem) {
        throw new IllegalStateException("Cannot move to next state from cancelled state.");
    }

    @Override
    public void cancel(OrderItem orderItem) {
        throw new IllegalStateException("Order already cancelled.");
    }

    @Override
    public String getStatus() {
        return "CANCELLED";
    }

}

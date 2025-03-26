package com.nus_iss.spring.backend.state;

import com.nus_iss.spring.backend.entities.OrderItem;
import com.nus_iss.spring.backend.state.interfaces.OrderItemState;

public class PendingState implements OrderItemState {

    @Override
    public void next(OrderItem orderItem) {
        orderItem.setState(new ShippingState());
    }

    @Override
    public void cancel(OrderItem orderItem) {
        orderItem.setState(new CancelledState());
    }

    @Override
    public String getStatus() {
        return "PENDING";
    }

}

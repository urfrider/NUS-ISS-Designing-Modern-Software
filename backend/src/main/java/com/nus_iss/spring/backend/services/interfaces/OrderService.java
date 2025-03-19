package com.nus_iss.spring.backend.services.interfaces;

import java.util.List;

import com.nus_iss.spring.backend.entities.Cart;
import com.nus_iss.spring.backend.entities.OrderItem;

public interface OrderService {
    Long createOrder(Cart orderDto);
    
    List<OrderItem> getOrderItemsBySellerId(Long sellerId);
}

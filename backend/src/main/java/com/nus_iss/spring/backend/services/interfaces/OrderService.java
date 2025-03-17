package com.nus_iss.spring.backend.services.interfaces;

import java.util.List;

import com.nus_iss.spring.backend.dtos.OrderDto;
import com.nus_iss.spring.backend.entities.Order;
import com.nus_iss.spring.backend.entities.OrderItem;

public interface OrderService {
    Long createOrder(OrderDto orderDto);
    
    List<OrderItem> getOrderItemsBySellerId(Long sellerId);
}

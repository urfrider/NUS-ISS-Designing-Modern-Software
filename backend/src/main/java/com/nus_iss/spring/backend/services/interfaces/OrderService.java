package com.nus_iss.spring.backend.services.interfaces;

import java.util.List;

import com.nus_iss.spring.backend.dtos.OrderDto;
import com.nus_iss.spring.backend.dtos.OrderItemDto;
import com.nus_iss.spring.backend.entities.Cart;

public interface OrderService {
    Long createOrder(Cart orderDto);
    
    List<OrderItemDto> getOrderItemsBySellerId(Long sellerId);

    List<OrderDto> getOrdersBySellerId(Long sellerId);

    List<OrderDto> getOrdersByBuyerId(Long buyerId);

    // List<OrderItem> getOrderItemsByBuyerId(Long buyerId);
}

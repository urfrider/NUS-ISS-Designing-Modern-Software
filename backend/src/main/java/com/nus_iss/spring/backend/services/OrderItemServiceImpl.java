package com.nus_iss.spring.backend.services;

import org.springframework.stereotype.Service;

import com.nus_iss.spring.backend.entities.OrderItem;
import com.nus_iss.spring.backend.repositories.OrderItemRepository;
import com.nus_iss.spring.backend.services.interfaces.OrderItemService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class OrderItemServiceImpl implements OrderItemService {

    private final OrderItemRepository orderItemRepository;

    @Override
    public void nextState(Long orderItemId) {
        OrderItem orderItem = orderItemRepository.findById(orderItemId)
            .orElseThrow(() -> new RuntimeException("Order Item not found!"));
        orderItem.nextState();
        orderItemRepository.save(orderItem);
    }

    @Override
    public void cancelOrder(Long orderItemId) {
        OrderItem orderItem = orderItemRepository.findById(orderItemId)
            .orElseThrow(() -> new RuntimeException("Order Item not found!"));
        orderItem.cancel();
        orderItemRepository.save(orderItem);
    }

}

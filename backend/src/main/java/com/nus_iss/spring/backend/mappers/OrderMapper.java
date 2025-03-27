package com.nus_iss.spring.backend.mappers;

import java.util.List;
import java.util.stream.Collectors;

import com.nus_iss.spring.backend.dtos.OrderDto;
import com.nus_iss.spring.backend.entities.Order;

public class OrderMapper {

    public static OrderDto toDto(Order order) {
        if (order == null) {
            return null;
        }

        return new OrderDto(
            order.getId(),
            order.getBuyer().getId(),
            order.getTotalAmount(),
            order.getStatus(),
            order.getCreatedAt(),
            order.getOrderItems().stream()
                .map(OrderItemMapper::toDTO)
                .collect(Collectors.toList()) // Convert order items to DTOs
        );
    }

    public static List<OrderDto> toDtoList(List<Order> orders) {
        return orders.stream()
                .map(OrderMapper::toDto)
                .collect(Collectors.toList());
    }

    public static Order toEntity(OrderDto orderDto) {
        if (orderDto == null) {
            return null;
        }

        Order order = new Order();
        order.setId(orderDto.getId());
        order.setTotalAmount(orderDto.getTotalAmount());
        order.setStatus(orderDto.getStatus());
        order.setCreatedAt(orderDto.getCreatedAt());

        return order;
    }
}

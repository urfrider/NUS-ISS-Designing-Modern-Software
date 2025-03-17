package com.nus_iss.spring.backend.mappers;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Component;

import com.nus_iss.spring.backend.dtos.OrderDto;
import com.nus_iss.spring.backend.entities.Buyer;
import com.nus_iss.spring.backend.entities.Order;
import com.nus_iss.spring.backend.entities.OrderItem;

@Component
public class OrderMapper {

    public Order toEntity(OrderDto orderDto, Buyer buyer){
        Order order = new Order();
        order.setBuyer(buyer);
        order.setCreatedAt(new Date());
        order.setStatus(orderDto.getStatus());
        order.setTotalAmount(orderDto.getTotalAmount());

        return order;
    }

    // public OrderDto toDto(Order order){
    //     OrderDto orderDto = new OrderDto();
    //     orderDto.setId(order.getId()); 
    //     orderDto.setBuyerId(order.getBuyer().getId());
    //     orderDto.setOrderItems(order.getOrderItems());
    //     orderDto.setStatus(order.getStatus());
    //     orderDto.setTotalAmount(order.getTotalAmount());      
    //     return orderDto;
    // }
}

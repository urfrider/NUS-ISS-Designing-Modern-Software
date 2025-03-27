package com.nus_iss.spring.backend.mappers;

import java.util.List;
import java.util.stream.Collectors;

import com.nus_iss.spring.backend.dtos.OrderItemDto;
import com.nus_iss.spring.backend.entities.Order;
import com.nus_iss.spring.backend.entities.OrderItem;
import com.nus_iss.spring.backend.entities.Product;
import com.nus_iss.spring.backend.entities.Seller;

public class OrderItemMapper {

    public static OrderItemDto toDTO(OrderItem orderItem) {
        if (orderItem == null) {
            return null;
        }
        OrderItemDto dto = new OrderItemDto();
        dto.setId(orderItem.getId());
        dto.setOrderId(orderItem.getOrder().getId());
        dto.setProductId(orderItem.getProduct().getId());
        dto.setSellerId(orderItem.getSeller().getId());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());
        dto.setStatus(orderItem.getStatus());
        return dto;
    }

    public static OrderItem toEntity(OrderItemDto dto) {
        if (dto == null) {
            return null;
        }
        OrderItem orderItem = new OrderItem();
        orderItem.setId(dto.getId());
        // orderItem.setOrder(order);
        // orderItem.setProduct(product);
        // orderItem.setSeller(seller);
        orderItem.setQuantity(dto.getQuantity());
        orderItem.setPrice(dto.getPrice());
        orderItem.setStatus(dto.getStatus());
        return orderItem;
    }

    public static List<OrderItemDto> toDTOList(List<OrderItem> orderItems) {
        return orderItems.stream().map(OrderItemMapper::toDTO).collect(Collectors.toList());
    }

    public static List<OrderItem> toEntityList(List<OrderItemDto> dtos) {
        return dtos.stream().map(dto -> toEntity(dto)).collect(Collectors.toList());
    }
}
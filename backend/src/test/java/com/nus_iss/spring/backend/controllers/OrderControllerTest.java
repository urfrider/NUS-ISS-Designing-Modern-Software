package com.nus_iss.spring.backend.controllers;

import com.nus_iss.spring.backend.dtos.OrderDto;
import com.nus_iss.spring.backend.dtos.OrderItemDto;
import com.nus_iss.spring.backend.services.BuyerServiceImpl;
import com.nus_iss.spring.backend.services.OrderServiceImpl;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class OrderControllerTest {

    @Mock
    OrderServiceImpl orderService;

    @Mock
    BuyerServiceImpl buyerService;

    @InjectMocks
    OrderController orderController;

    public OrderControllerTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetOrdersBySellerId() {
        // Arrange
        List<OrderDto> orderDtos = new ArrayList<>();
        OrderDto orderDto = new OrderDto();
        orderDto.setId(1L);
        orderDto.setStatus("test");
        orderDtos.add(orderDto);

        OrderDto orderDto2 = new OrderDto();
        orderDto2.setId(2L);
        orderDto2.setStatus("test2");
        orderDtos.add(orderDto2);

        when(orderService.getOrdersBySellerId(any(Long.class))).thenReturn(orderDtos);

        // Act
        ResponseEntity<?> response = orderController.getOrdersBySellerId(1L);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<OrderDto> responseData = (List<OrderDto>) response.getBody();

        assertEquals(1L, responseData.get(0).getId());
        assertEquals("test", responseData.get(0).getStatus());
        assertEquals(2L, responseData.get(1).getId());
        assertEquals("test2", responseData.get(1).getStatus());
    }

    @Test
    public void testGetOrderItemsBySellerId() {
        // Arrange
        List<OrderItemDto> orderItemDtos = new ArrayList<>();
        OrderItemDto orderItemDtoDto = new OrderItemDto();
        orderItemDtoDto.setId(1L);
        orderItemDtoDto.setStatus("test");
        orderItemDtos.add(orderItemDtoDto);

        OrderItemDto orderItemDtoDto2 = new OrderItemDto();
        orderItemDtoDto2.setId(2L);
        orderItemDtoDto2.setStatus("test2");
        orderItemDtos.add(orderItemDtoDto2);

        when(orderService.getOrderItemsBySellerId(any(Long.class))).thenReturn(orderItemDtos);

        // Act
        ResponseEntity<?> response = orderController.getOrderItemsBySellerId(1L);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<OrderItemDto> responseData = (List<OrderItemDto>) response.getBody();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, responseData.get(0).getId());
        assertEquals("test", responseData.get(0).getStatus());
        assertEquals(2L, responseData.get(1).getId());
        assertEquals("test2", responseData.get(1).getStatus());
    }

    @Test
    public void testGetOrdersByBuyerId() {
        List<OrderDto> orderDtos = new ArrayList<>();
        OrderDto orderDto = new OrderDto();
        orderDto.setId(1L);
        orderDto.setStatus("test");
        orderDtos.add(orderDto);
        OrderDto orderDto2 = new OrderDto();
        orderDto2.setId(2L);
        orderDto2.setStatus("test2");
        orderDtos.add(orderDto2);

        when(orderService.getOrdersByBuyerId(any(Long.class))).thenReturn(orderDtos);

        ResponseEntity<?> response = orderController.getOrdersByBuyerId(1L);

        List<OrderDto> responseData = (List<OrderDto>) response.getBody();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, responseData.get(0).getId());
        assertEquals("test", responseData.get(0).getStatus());
        assertEquals(2L, responseData.get(1).getId());
        assertEquals("test2", responseData.get(1).getStatus());
    }

    @Test
    public void testGetBuyerAddress() {
        String address = "test";

        when(buyerService.getBuyerAddress(any(Long.class))).thenReturn(address);

        ResponseEntity<?> response = orderController.getBuyerAddress(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(address, response.getBody());
    }
}

package com.nus_iss.spring.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nus_iss.spring.backend.dtos.OrderDto;
import com.nus_iss.spring.backend.entities.Order;
import com.nus_iss.spring.backend.entities.OrderItem;
import com.nus_iss.spring.backend.services.interfaces.OrderService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER')")
    public ResponseEntity<?> createOrders(@RequestBody OrderDto entity) {
        try {
            Long orderId = orderService.createOrder(entity);
            return new ResponseEntity<>(orderId, HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }
    
    @GetMapping("/seller/{sellerId}")
    @PreAuthorize("hasAnyAuthority('ROLE_SELLER')")
    public ResponseEntity<?> getOrderItemsBySellerId(@PathVariable Long id) {
        try {
            List<OrderItem> orderItems = orderService.getOrderItemsBySellerId(id);
            return new ResponseEntity<>(orderItems, HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }
    
}

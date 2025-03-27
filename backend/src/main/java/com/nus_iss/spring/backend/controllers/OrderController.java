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
import com.nus_iss.spring.backend.dtos.OrderItemDto;
import com.nus_iss.spring.backend.services.interfaces.OrderService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



// @RestController
// @CrossOrigin(origins = "http://localhost:5173")
// @RequestMapping("/api/orders")
// public class OrderController {

//     @Autowired
//     private OrderService orderService;
    
//     @GetMapping("/seller/{sellerId}")
//     @PreAuthorize("hasAnyAuthority('ROLE_SELLER')")
//     public ResponseEntity<?> getOrderItemsBySellerId(@PathVariable Long sellerId) {
//         try {
//             List<OrderItemDto> orderItems = orderService.getOrderItemsBySellerId(sellerId);
//             return new ResponseEntity<>(orderItems, HttpStatus.OK);
//         } catch (Exception e) {
//             return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
//         }
//     }

// }


@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // 1. Get list of orders as a seller
    @GetMapping("/orders/seller/{sellerId}")
    @PreAuthorize("hasAnyAuthority('ROLE_SELLER')")
    public ResponseEntity<?> getOrdersBySellerId(@PathVariable Long sellerId) {
        try {
            List<OrderDto> orders = orderService.getOrdersBySellerId(sellerId);
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    // 2. Get list of order items as a seller
    @GetMapping("/order-items/seller/{sellerId}")
    @PreAuthorize("hasAnyAuthority('ROLE_SELLER')")
    public ResponseEntity<?> getOrderItemsBySellerId(@PathVariable Long sellerId) {
        try {
            List<OrderItemDto> orderItems = orderService.getOrderItemsBySellerId(sellerId);
            return new ResponseEntity<>(orderItems, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    // 3. Get list of orders as a buyer
    @GetMapping("/orders/buyer/{buyerId}")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER')")
    public ResponseEntity<?> getOrdersByBuyerId(@PathVariable Long buyerId) {
        try {
            List<OrderDto> orders = orderService.getOrdersByBuyerId(buyerId);
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    // // 4. Get list of order items as a buyer
    // @GetMapping("/order-items/buyer/{buyerId}")
    // @PreAuthorize("hasAnyAuthority('ROLE_BUYER')")
    // public ResponseEntity<?> getOrderItemsByBuyerId(@PathVariable Long buyerId) {
    //     try {
    //         List<OrderItemDto> orderItems = orderService.getOrderItemsByBuyerId(buyerId);
    //         return new ResponseEntity<>(orderItems, HttpStatus.OK);
    //     } catch (Exception e) {
    //         return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
    //     }
    // }
}
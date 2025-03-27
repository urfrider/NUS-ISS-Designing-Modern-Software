package com.nus_iss.spring.backend.services;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nus_iss.spring.backend.dtos.OrderDto;
import com.nus_iss.spring.backend.dtos.OrderItemDto;
import com.nus_iss.spring.backend.entities.Cart;
import com.nus_iss.spring.backend.entities.Order;
import com.nus_iss.spring.backend.entities.OrderItem;
import com.nus_iss.spring.backend.mappers.OrderItemMapper;
import com.nus_iss.spring.backend.mappers.OrderMapper;
import com.nus_iss.spring.backend.repositories.BuyerRepository;
import com.nus_iss.spring.backend.repositories.OrderItemRepository;
import com.nus_iss.spring.backend.repositories.OrderRepository;
import com.nus_iss.spring.backend.repositories.SellerRepository;
import com.nus_iss.spring.backend.services.interfaces.OrderService;
import com.nus_iss.spring.backend.state.PendingState;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final SellerRepository sellerRepository;
    private final BuyerRepository buyerRepository;

    @Override
    public Long createOrder(Cart cart) {
        Order order = new Order();
        order.setBuyer(cart.getBuyer());
        order.setCreatedAt(new Date());
        order.setStatus("Order Received");
        order.setTotalAmount(cart.getTotalAmount());
        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = cart.getCartItems().stream()
            .map((cartItem) -> {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(savedOrder);
                orderItem.setProduct(cartItem.getProduct());
                orderItem.setSeller(cartItem.getProduct().getSeller());
                orderItem.setQuantity(cartItem.getQuantity());
                orderItem.setPrice(cartItem.getProduct().getPrice());
                orderItem.setState(new PendingState());
                return orderItem;
            }).collect(Collectors.toList());

        orderItemRepository.saveAll(orderItems);
        savedOrder.getOrderItems().addAll(orderItems);
        return orderRepository.save(savedOrder).getId();
    }

    @Override
    @Transactional
    public List<OrderItemDto> getOrderItemsBySellerId(Long sellerId) {
        checkIfSellerExist(sellerId);
        
        List<OrderItem> res = orderItemRepository.findBySeller_Id(sellerId);
        return OrderItemMapper.toDTOList(res);
    }

    @Override
    @Transactional
    public List<OrderDto> getOrdersBySellerId(Long sellerId) {
        checkIfSellerExist(sellerId);

        List<Order> res = orderRepository.findOrdersBySellerId(sellerId);
        return OrderMapper.toDtoList(res);
    }

    public void checkIfSellerExist(Long sellerId) {
        sellerRepository.findById(sellerId)
            .orElseThrow(() -> new EntityNotFoundException("Seller with ID " + sellerId + " not found!"));
    }

    public void checkIfBuyerExist(Long buyerId) {
        buyerRepository.findById(buyerId)
            .orElseThrow(() -> new EntityNotFoundException("Buyer with ID " + buyerId + " not found!"));
    }

    @Override
    @Transactional
    public List<OrderDto> getOrdersByBuyerId(Long buyerId) {
        checkIfBuyerExist(buyerId);

        List<Order> res = orderRepository.findByBuyerId(buyerId);

        return OrderMapper.toDtoList(res);
    }

    // @Override
    // @Transactional
    // public List<OrderItem> getOrderItemsByBuyerId(Long buyerId) {
    //     List<Order> orders = orderRepository.findByBuyerId(buyerId)
    //             .orElseThrow(() -> new RuntimeException("Order with ID " + buyerId + " does not exist!"));

    //     System.out.println("Orderssss" + orders);
    //     List<OrderItem> orderItems = orders.stream()
    //             .flatMap(order -> order.getOrderItems().stream()) // Assuming each order has a collection of order items
    //             .collect(Collectors.toList()); // Collect the results into a List

    //     return orderItems;
    // }
}

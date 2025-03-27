package com.nus_iss.spring.backend.services;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.nus_iss.spring.backend.entities.Cart;
import com.nus_iss.spring.backend.entities.Order;
import com.nus_iss.spring.backend.entities.OrderItem;
import com.nus_iss.spring.backend.entities.Seller;
import com.nus_iss.spring.backend.repositories.OrderItemRepository;
import com.nus_iss.spring.backend.repositories.OrderRepository;
import com.nus_iss.spring.backend.repositories.SellerRepository;
import com.nus_iss.spring.backend.services.interfaces.OrderService;
import com.nus_iss.spring.backend.state.PendingState;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final SellerRepository sellerRepository;

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
    public List<OrderItem> getOrderItemsBySellerId(Long sellerId) {
        Seller seller = sellerRepository.findById(sellerId)
            .orElseThrow(() -> new RuntimeException("Seller with ID " + sellerId + " does not exist!"));
        
        return orderItemRepository.findBySellerId(seller.getId());
    }

}

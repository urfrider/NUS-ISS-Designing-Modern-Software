package com.nus_iss.spring.backend.services;

import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nus_iss.spring.backend.controllers.UserController;
import com.nus_iss.spring.backend.dtos.OrderDto;
import com.nus_iss.spring.backend.entities.Buyer;
import com.nus_iss.spring.backend.entities.Order;
import com.nus_iss.spring.backend.entities.OrderItem;
import com.nus_iss.spring.backend.entities.Product;
import com.nus_iss.spring.backend.entities.Seller;
import com.nus_iss.spring.backend.mappers.OrderMapper;
import com.nus_iss.spring.backend.repositories.BuyerRepository;
import com.nus_iss.spring.backend.repositories.OrderItemRepository;
import com.nus_iss.spring.backend.repositories.OrderRepository;
import com.nus_iss.spring.backend.repositories.ProductRepository;
import com.nus_iss.spring.backend.repositories.SellerRepository;
import com.nus_iss.spring.backend.services.interfaces.OrderService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final SellerRepository sellerRepository;
    private final BuyerRepository buyerRepository;
    private final ProductRepository productRepository;
    private final OrderMapper orderMapper;
    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    @Override
    public Long createOrder(OrderDto orderDto) {
        Buyer buyer = buyerRepository.findById(orderDto.getBuyerId())
            .orElseThrow(() -> new RuntimeException("Buyer with ID " + orderDto.getBuyerId() + " does not exist!"));
        Order order = orderMapper.toEntity(orderDto, buyer);
        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = orderDto.getOrderItems().stream()
            .map((orderItemDto) -> {
                Product product = productRepository.findById(orderItemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product does not Exist"));
                Seller seller = sellerRepository.findById(orderItemDto.getSellerId())
                    .orElseThrow(() -> new RuntimeException("Seller does not Exist"));
                
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(savedOrder);
                orderItem.setProduct(product);
                orderItem.setSeller(seller);
                orderItem.setQuantity(orderItemDto.getQuantity());
                orderItem.setPrice(orderItemDto.getPrice());
                orderItem.setStatus("PENDING");
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

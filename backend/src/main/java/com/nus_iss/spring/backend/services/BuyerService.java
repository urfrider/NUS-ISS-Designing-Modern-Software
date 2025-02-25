package com.nus_iss.spring.backend.services;

import lombok.RequiredArgsConstructor;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nus_iss.spring.backend.dtos.BuyerDto;
import com.nus_iss.spring.backend.entities.Buyer;
import com.nus_iss.spring.backend.mappers.BuyerMapper;
import com.nus_iss.spring.backend.repositories.BuyerRepository;

@Service
@RequiredArgsConstructor
public class BuyerService {
    private final BuyerRepository buyerRepository;
    // private final OrderRepository orderRepository;
    // private final ProductRepository productRepository;

    public BuyerDto getBuyerById(Long id) {
        Optional<Buyer> buyerOptional = buyerRepository.findById(id);
        
        if (buyerOptional.isPresent()) {
            System.out.println("Buyer found: " + buyerOptional.get());  // Print if found
            return BuyerMapper.toDto(buyerOptional.get());
        } else {
            System.out.println("Buyer not found with ID: " + id);  // Print if not found
            throw new RuntimeException("Buyer not found");
        }
    }

    // public List<OrderDTO> getOrderHistory(Long buyerId) {
    //     Buyer buyer = buyerRepository.findById(buyerId)
    //             .orElseThrow(() -> new RuntimeException("Buyer not found"));

    //     return buyer.getOrderHistory().stream()
    //             .map(order -> new OrderDTO(order.getId(), order.getBuyer().getId(), order.getSeller().getId(), order.getProduct().getId()))
    //             .toList();
    // }

    // @Transactional
    // public void addToCart(Long buyerId, Long productId) {
    //     Buyer buyer = buyerRepository.findById(buyerId)
    //             .orElseThrow(() -> new RuntimeException("Buyer not found"));
    //     Product product = productRepository.findById(productId)
    //             .orElseThrow(() -> new RuntimeException("Product not found"));

    //     Order newOrder = new Order();
    //     newOrder.setBuyer(buyer);
    //     newOrder.setSeller(product.getSeller());
    //     newOrder.setProduct(product);

    //     orderRepository.save(newOrder);
    // }

    @Transactional
    public void checkout(Long buyerId) {
        System.out.println("Checkout complete for buyer " + buyerId);
    }
}

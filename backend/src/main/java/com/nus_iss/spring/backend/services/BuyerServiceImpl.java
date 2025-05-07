package com.nus_iss.spring.backend.services;

import lombok.RequiredArgsConstructor;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nus_iss.spring.backend.dtos.BuyerDto;
import com.nus_iss.spring.backend.entities.Buyer;
import com.nus_iss.spring.backend.mappers.BuyerMapper;
import com.nus_iss.spring.backend.repositories.BuyerRepository;
import com.nus_iss.spring.backend.services.interfaces.BuyerService;

@Service
@RequiredArgsConstructor
public class BuyerServiceImpl implements BuyerService {
    private final BuyerRepository buyerRepository;
    
    @Override
    public BuyerDto getBuyerById(Long id) {
        Optional<Buyer> buyerOptional = buyerRepository.findById(id);
        
        if (buyerOptional.isPresent()) {
            return BuyerMapper.toDto(buyerOptional.get());
        } else {
            throw new RuntimeException("Buyer not found");
        }
    }

    @Override
    @Transactional
    public Buyer getBuyerByUsername(String username) {
        Optional<Buyer> buyerOptional = buyerRepository.findByUsername(username);
        
        if (buyerOptional.isPresent()) {
            return buyerOptional.get();
        } else {
            throw new RuntimeException("Buyer not found");
        }
    }

    @Override
    @Transactional
    public BuyerDto editBuyerProfile(BuyerDto buyerDto) {
        Long buyerId = buyerDto.getId();
        Optional<Buyer> buyerOptional = buyerRepository.findById(buyerId);
        
        if (buyerOptional.isPresent()) {
            Buyer buyer = buyerOptional.get();
            buyer.setUsername(buyerDto.getUsername());
            buyer.setAddress(buyerDto.getAddress());
            buyerRepository.save(buyer);
            return buyerDto;
        } else {
            throw new RuntimeException("Buyer not found");
        }
    }

    @Override
    @Transactional
    public BuyerDto deleteBuyerProfile(Long buyerId) {
        Optional<Buyer> buyerOptional = buyerRepository.findById(buyerId);

        if (buyerOptional.isPresent()) {
            Buyer buyer = buyerOptional.get();
            buyerRepository.delete(buyer);
            return BuyerMapper.toDto(buyer);
        } else {
            throw new RuntimeException("Buyer not found");
        }
    }

    @Override
    @Transactional
    public String getBuyerAddress(Long buyerId) {
        Optional<Buyer> buyerOptional = buyerRepository.findById(buyerId);
        
        if (buyerOptional.isPresent()) {
            Buyer buyer = buyerOptional.get();
            return buyer.getAddress();
        } else {
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

    @Override
    @Transactional
    public void checkout(Long buyerId) {
        System.out.println("Checkout complete for buyer " + buyerId);
    }
}

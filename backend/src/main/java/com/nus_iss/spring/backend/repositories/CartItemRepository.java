package com.nus_iss.spring.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nus_iss.spring.backend.entities.Cart;
import com.nus_iss.spring.backend.entities.CartItem;
import java.util.List;


public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCart(Cart cart);
}
